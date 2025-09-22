import type { NextApiRequest, NextApiResponse } from "next";
// panchang calculator logic moved to core module
import type {
  BirthTimeInput,
  AstronomicalCalculationResult,
  KundaliErrorResponse
} from "../../types/kundali-types";
import { convertToUtcDateTime } from "@internal/core/convert-to-utc";
import { validateBirthTimeInput } from "@internal/core/validate-birth-time";
import {
  createSiderealPositions,
  calculatePanchangaData,
  calculatePlanetaryPositions,
  createPlanetaryPositions
} from "@internal/core/create-sidereal-positions";


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
