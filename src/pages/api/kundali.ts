import type { NextApiRequest, NextApiResponse } from "next";
import * as panchang from "@bidyashish/panchang";
import type { AstronomicalCalculator } from "@bidyashish/panchang";
import { zonedTimeToUtc } from "date-fns-tz";
import type {
  BirthTimeInput,
  PlanetaryPosition,
  SiderealPlanetPosition,
  AstronomicalCalculationResult,
  KundaliErrorResponse,
  PanchangaResult,
  PlanetName,
  Rashi
} from "../../types/kundali-types";
import { RASHI } from "../../types/kundali-types";

// Constants
const SUPPORTED_PLANETS = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Rahu",
  "Ketu"
] as const satisfies readonly PlanetName[];

/** Approximate Lahiri ayanamsa for basic calculations */
const APPROXIMATE_AYANAMSA = 23.44;

// Utility functions for astronomical calculations
function validateBirthTimeInput(input: unknown): input is BirthTimeInput {
  if (!input || typeof input !== "object") return false;
  
  const data = input as Record<string, unknown>;
  
  return (
    typeof data.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(data.date) &&
    typeof data.time === "string" &&
    /^\d{2}:\d{2}(:\d{2})?$/.test(data.time) &&
    typeof data.latitude === "number" &&
    data.latitude >= -90 &&
    data.latitude <= 90 &&
    typeof data.longitude === "number" &&
    data.longitude >= -180 &&
    data.longitude <= 180 &&
    typeof data.timezone === "string" &&
    data.timezone.length > 0
  );
}

function normalizeTimeFormat(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

function convertToUtcDateTime(date: string, time: string, timezone: string): Date {
  const normalizedTime = normalizeTimeFormat(time);
  const localIsoString = `${date}T${normalizedTime}`;
  return zonedTimeToUtc(localIsoString, timezone);
}

function tropicalToSiderealLongitude(tropicalDegrees: number): number {
  const siderealDegrees = tropicalDegrees - APPROXIMATE_AYANAMSA;
  return siderealDegrees < 0 ? siderealDegrees + 360 : siderealDegrees;
}

function normalizeLongitude(degrees: number): number {
  let normalized = degrees % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

function calculateZodiacSignData(longitude: number): {
  sign: number;
  degreesInSign: number;
  rashiName: Rashi;
} {
  const normalizedLongitude = normalizeLongitude(longitude);
  const sign = Math.floor(normalizedLongitude / 30) + 1; // 1-12
  const degreesInSign = normalizedLongitude - (sign - 1) * 30;
  const rashiName = RASHI[sign - 1];
  
  return { sign, degreesInSign, rashiName };
}

async function calculatePanchangaData(
  utcDateTime: Date,
  latitude: number,
  longitude: number,
  timezone: string
): Promise<PanchangaResult> {
  return await panchang.getPanchanga(utcDateTime, latitude, longitude, timezone);
}

interface RawPlanetData {
  longitude?: number;
  latitude?: number;
  distance?: number;
  longitudeSpeed?: number;
  siderealLongitude?: number;
}

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

function createSiderealPositions(
  rawData: Record<PlanetName, RawPlanetData | undefined>
): readonly SiderealPlanetPosition[] {
  return SUPPORTED_PLANETS.map((planet): SiderealPlanetPosition => {
    const raw = rawData[planet];
    const tropicalLongitude = raw?.longitude ?? 0;
    const siderealLongitude = normalizeLongitude(
      tropicalToSiderealLongitude(tropicalLongitude)
    );
    
    const { sign, degreesInSign, rashiName } = calculateZodiacSignData(siderealLongitude);
    
    return {
      planet,
      siderealLongitude,
      zodiacSign: sign,
      degreesInSign,
      rashiName
    };
  });
}

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
