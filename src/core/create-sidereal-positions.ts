import type { Rashi, PlanetName, SiderealPlanetPosition } from "../types/kundali-types";
import { RASHI } from "../types/kundali-types";

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

    return {
      planet,
      siderealLongitude,
      zodiacSign: sign,
      degreesInSign,
      rashiName
    };
  });
}
