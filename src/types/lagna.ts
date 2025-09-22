import { PlanetPosition } from "@bidyashish/panchang";
import { Rashi } from "./zodic";

export interface LagnaTable {
  birthDate: Date;             // UTC birth date
  latitude: number;
  longitude: number;
  ascendant: number;           // Ascendant longitude in degrees
  ascendantRashi: number;      // 0-11
  ascendantRashiName: Rashi;   // Name from enum
  houses: Record<number, Rashi>; // Mapping: houseNumber → Rashi
  planets: PlanetPosition[];   // Array of all planets
}