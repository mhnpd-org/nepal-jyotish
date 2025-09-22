import type { PanchangaResult, AstronomicalCalculator } from "@bidyashish/panchang";
import type { PlanetName } from "@internal/types/planets";
import { RASHI, NAKSHATRA, HOUSE_LABELS, type Rashi, type Nakshatra, type House } from "@internal/types/zodic";

// Input validation schemas
export interface BirthTimeInput {
  /** Birth date in YYYY-MM-DD format */
  readonly date: string;
  /** Birth time in HH:mm or HH:mm:ss format */
  readonly time: string;
  /** Geographic latitude in decimal degrees (-90 to 90) */
  readonly latitude: number;
  /** Geographic longitude in decimal degrees (-180 to 180) */
  readonly longitude: number;
  /** IANA timezone identifier (e.g., "Asia/Kathmandu") */
  readonly timezone: string;
}

// Core astrological data types
export interface AstronomicalPosition {
  /** Celestial longitude in degrees (0-360) */
  readonly longitude: number;
  /** Celestial latitude in degrees */
  readonly latitude: number;
  /** Distance from Earth (astronomical units) */
  readonly distance: number;
  /** Daily motion in longitude (degrees per day) */
  readonly longitudeSpeed: number;
}

export interface PlanetaryPosition {
  /** The celestial body name */
  readonly planet: PlanetName;
  /** Tropical coordinates */
  readonly tropicalPosition: AstronomicalPosition;
}

export interface SiderealPlanetPosition {
  /** The celestial body name */
  readonly planet: PlanetName;
  /** Sidereal longitude in degrees (0-360) */
  readonly siderealLongitude: number;
  /** Vedic zodiac sign (1-12, where 1=Aries) */
  readonly zodiacSign: number;
  /** Position within the sign (0-30 degrees) */
  readonly degreesInSign: number;
  /** Sanskrit name of the zodiac sign */
  readonly rashiName: Rashi;
  /** English or Nepali name from enum */
  readonly rashiLabel?: Rashi;

  /** House number (1-12) */
  readonly house: number;
  /** House label like "1st House" */
  readonly houseLabel: House;

  /** Nakshatra index (0-26) */
  readonly nakshatra: number;
  /** Nakshatra name from enum */
  readonly nakshatraName: Nakshatra;

  /** Degree within the Rashi (0-30) */
  readonly degreeInRashi: number;
  /** Degree within the Nakshatra (0-13.3333) */
  readonly degreeInNakshatra: number;
  /** Pada number (1-4) */
  readonly pada: number;
}

export interface AstronomicalCalculationResult {
  /** UTC timestamp of the calculation */
  readonly calculationTime: string;
  /** Geographic coordinates used */
  readonly coordinates: {
    readonly latitude: number;
    readonly longitude: number;
  };
  /** Timezone used for the calculation */
  readonly timezone: string;
  /** Vedic panchanga data */
  readonly panchangaData: PanchangaResult;
  /** Tropical planetary positions */
  readonly planetaryPositions: readonly PlanetaryPosition[];
  /** Sidereal planetary positions */
  readonly siderealPositions: readonly SiderealPlanetPosition[];
}

// Error response types
export interface ValidationError {
  readonly error: "VALIDATION_ERROR";
  readonly message: string;
  readonly field?: string;
}

export interface CalculationError {
  readonly error: "CALCULATION_ERROR";
  readonly message: string;
}

export interface MethodError {
  readonly error: "METHOD_NOT_ALLOWED";
  readonly message: string;
  readonly allowedMethods: readonly string[];
}

export type KundaliErrorResponse = ValidationError | CalculationError | MethodError;

export { RASHI, NAKSHATRA, HOUSE_LABELS };
export type { PanchangaResult, AstronomicalCalculator, PlanetName, Rashi, Nakshatra, House };
