// Shared planet names and type for backend and client
export const PLANET_NAMES = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
  'Rahu',
  'Ketu',
] as const;

export type PlanetName = (typeof PLANET_NAMES)[number];

export default PLANET_NAMES;
