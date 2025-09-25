export interface PositionTuple {
  longitude: number;
  latitude: number;
  distance?: number;
  longitudeSpeed?: number;
}

export interface PlanetaryPosition {
  planet: string;
  tropicalPosition: PositionTuple;
  siderealPosition?: PositionTuple;
}
