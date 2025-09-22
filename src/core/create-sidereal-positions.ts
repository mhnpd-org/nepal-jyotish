import type { Rashi, PlanetName, SiderealPlanetPosition, PanchangaResult, Nakshatra } from "../types/kundali-types";
import { RASHI, NAKSHATRA, HOUSE_LABELS } from "../types/kundali-types";
import * as panchang from "@bidyashish/panchang";
import type { AstronomicalCalculator } from "@bidyashish/panchang";


export const SUPPORTED_PLANETS = [
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

export type RawPlanetData = {
  longitude?: number;
  latitude?: number;
  distance?: number;
  longitudeSpeed?: number;
  siderealLongitude?: number;
};

export function tropicalToSiderealLongitude(tropicalDegrees: number): number {
  const siderealDegrees = tropicalDegrees - APPROXIMATE_AYANAMSA;
  return siderealDegrees < 0 ? siderealDegrees + 360 : siderealDegrees;
}

export function normalizeLongitude(degrees: number): number {
  let normalized = degrees % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

export function calculateZodiacSignData(longitude: number): {
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

/**
 * Calculate nakshatra related data for a sidereal longitude.
 * Nakshatras are 27 equal divisions of the ecliptic (360/27 = 13.333... degrees)
 */
export function calculateNakshatraData(longitude: number): {
  nakshatraIndex: number; // 0-26
  degreeInNakshatra: number; // 0-13.3333
  pada: number; // 1-4
  nakshatraName: Nakshatra;
} {
  const normalized = normalizeLongitude(longitude);
  const nakFraction = 360 / 27; // 13.333...
  const nakshatraIndex = Math.floor(normalized / nakFraction); // 0-26
  const startOfNak = nakshatraIndex * nakFraction;
  const degreeInNakshatra = normalized - startOfNak;
  const pada = Math.min(4, Math.floor((degreeInNakshatra / nakFraction) * 4) + 1);
  const nakshatraName = (NAKSHATRA as readonly Nakshatra[])[nakshatraIndex];

  return { nakshatraIndex, degreeInNakshatra, pada, nakshatraName };
}

export function createSiderealPositions(
  rawData: Record<PlanetName, RawPlanetData | undefined>
): readonly SiderealPlanetPosition[] {
  return SUPPORTED_PLANETS.map((planet): SiderealPlanetPosition => {
    const raw = rawData[planet];
    const tropicalLongitude = raw?.longitude ?? 0;
    const siderealLongitude = normalizeLongitude(
      tropicalToSiderealLongitude(tropicalLongitude)
    );

    const { sign, degreesInSign, rashiName } = calculateZodiacSignData(siderealLongitude);
    const { nakshatraIndex, degreeInNakshatra, pada, nakshatraName } = calculateNakshatraData(siderealLongitude);

    // In this implementation house is treated relative to Aries as 1.
    // If ascendant/lagna is available later, this should be shifted accordingly.
    const house = sign; // 1-12
    const houseLabel = HOUSE_LABELS[house - 1];

    return {
      planet,
      siderealLongitude,
      zodiacSign: sign,
      degreesInSign,
      rashiName,
      rashiLabel: rashiName,
      house,
      houseLabel,
      nakshatra: nakshatraIndex,
      nakshatraName: nakshatraName,
      degreeInRashi: degreesInSign,
      degreeInNakshatra,
      pada
    };
  });
}

export async function calculatePanchangaData(
  utcDateTime: Date,
  latitude: number,
  longitude: number,
  timezone: string
): Promise<PanchangaResult> {
  return await panchang.getPanchanga(utcDateTime, latitude, longitude, timezone);
}

export async function calculatePlanetaryPositions(
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

export function createPlanetaryPositions(
  rawData: Record<PlanetName, RawPlanetData | undefined>
): readonly import("../types/kundali-types").PlanetaryPosition[] {
  return SUPPORTED_PLANETS.map((planet) => {
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
