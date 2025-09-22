import type { NextApiRequest, NextApiResponse } from "next";
import * as panchang from "@bidyashish/panchang";
import type { AstronomicalCalculator } from "@bidyashish/panchang";
import type {
  BirthTimeInput,
  PlanetaryPosition,
  AstronomicalCalculationResult,
  KundaliErrorResponse,
  PanchangaResult,
  PlanetName
} from "../../types/kundali-types";
import { convertToUtcDateTime } from "@internal/core/convert-to-utc";
import { validateBirthTimeInput } from "@internal/core/validate-birth-time";
import {
  createSiderealPositions,
  SUPPORTED_PLANETS,
  type RawPlanetData
} from "@internal/core/create-sidereal-positions";

// Helpers and constants moved to `src/core/create-sidereal-positions.ts`

async function calculatePanchangaData(
  utcDateTime: Date,
  latitude: number,
  longitude: number,
  timezone: string
): Promise<PanchangaResult> {
  return await panchang.getPanchanga(utcDateTime, latitude, longitude, timezone);
}

// RawPlanetData type re-exported from core module

async function calculatePlanetaryPositions(
  utcDateTime: Date
): Promise<Record<PlanetName, RawPlanetData | undefined>> {
  const calculator: AstronomicalCalculator = new panchang.AstronomicalCalculator();
  
  // Type-safe way to handle the library's dynamic API
  const calculatorAny = calculator as unknown as {
    calculatePlanetaryPositions?: (
      date: Date,
      planets: string[]
    ) => Record<string, RawPlanetData>;
    calculatePlanetPosition?: (planet: string, date: Date) => Promise<RawPlanetData>;
  };

  let planetaryData: Record<string, RawPlanetData | undefined> = {};

  // Try batch calculation first
  if (typeof calculatorAny.calculatePlanetaryPositions === "function") {
    const batchData = calculatorAny.calculatePlanetaryPositions(
      utcDateTime,
      SUPPORTED_PLANETS as unknown as string[]
    );
    planetaryData = { ...batchData };
  } else if (typeof calculatorAny.calculatePlanetPosition === "function") {
    // Fallback to individual calculations
    for (const planet of SUPPORTED_PLANETS) {
      try {
        const position = await calculatorAny.calculatePlanetPosition(
          planet as string,
          utcDateTime
        );
        planetaryData[planet] = position;
      } catch (error) {
        console.warn(`Failed to calculate position for ${planet}:`, error);
        planetaryData[planet] = undefined;
      }
    }
  }

  return planetaryData as Record<PlanetName, RawPlanetData | undefined>;
}

function createPlanetaryPositions(
  rawData: Record<PlanetName, RawPlanetData | undefined>
): readonly PlanetaryPosition[] {
  return SUPPORTED_PLANETS.map((planet): PlanetaryPosition => {
    const raw = rawData[planet];
    const longitude = raw?.siderealLongitude ?? raw?.longitude ?? 0;
    
    return {
      planet,
      tropicalPosition: {
        longitude,
        latitude: raw?.latitude ?? 0,
        distance: raw?.distance ?? 0,
        longitudeSpeed: raw?.longitudeSpeed ?? 0
      }
    };
  });
}
// createSiderealPositions implemented in core module

/**
 * Calculate Vedic astrological data (Kundali) for a given birth time and location.
 * 
 * @param birthTimeInput - Birth date, time, and location information
 * @returns Complete astrological calculation including panchanga and planetary positions
 */
export default async function calculateKundaliData(
  req: NextApiRequest,
  res: NextApiResponse<AstronomicalCalculationResult | KundaliErrorResponse>
): Promise<void> {
  try {
    // Validate HTTP method
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "METHOD_NOT_ALLOWED",
        message: "Only POST requests are allowed for this endpoint.",
        allowedMethods: ["POST"]
      });
    }

    // Validate input data
    if (!validateBirthTimeInput(req.body)) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid input data. Please check date format (YYYY-MM-DD), time format (HH:mm), coordinates, and timezone."
      });
    }

    const birthTimeInput = req.body as BirthTimeInput;
    const { date, time, timezone, latitude, longitude } = birthTimeInput;

    // Convert to UTC for calculations
    const utcDateTime = convertToUtcDateTime(date, time, timezone);
    
    console.log("Calculating Kundali for UTC time:", utcDateTime.toISOString());

    // Perform all astronomical calculations
    const [panchangaData, rawPlanetaryData] = await Promise.all([
      calculatePanchangaData(utcDateTime, latitude, longitude, timezone),
      calculatePlanetaryPositions(utcDateTime)
    ]);

    // Process planetary position data
    const planetaryPositions = createPlanetaryPositions(rawPlanetaryData);
    const siderealPositions = createSiderealPositions(rawPlanetaryData);

    // Prepare final response
    const calculationResult: AstronomicalCalculationResult = {
      calculationTime: utcDateTime.toISOString(),
      coordinates: { latitude, longitude },
      timezone,
      panchangaData,
      planetaryPositions,
      siderealPositions
    };

    return res.status(200).json(calculationResult);
    
  } catch (error: unknown) {
    console.error("Kundali calculation error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown calculation error occurred";
    
    return res.status(500).json({
      error: "CALCULATION_ERROR",
      message: errorMessage
    });
  }
}
