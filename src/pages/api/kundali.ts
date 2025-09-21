import type { NextApiRequest, NextApiResponse } from 'next';
import * as panchang from '@bidyashish/panchang';
import type { PanchangaResult, PlanetPosition } from '@bidyashish/panchang';
import { PLANET_NAMES, type PlanetName } from '@internal/types/planets';

export interface KundaliRequest {
  date: string; // ISO string or "YYYY-MM-DD"
  time: string; // "HH:mm:ss" in 24-hour format
  latitude: number;
  longitude: number;
  timezone: string; // IANA Timezone, e.g., "Asia/Kathmandu"
}

export interface KundaliResponse {
  dateTime: string;
  latitude: number;
  longitude: number;
  timezone: string;
  panchanga: PanchangaResult;
  planets?: Array<{ planet: string; position: PlanetPosition }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KundaliResponse | { error: string }>
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const body: KundaliRequest = req.body;

    if (
      !body.date ||
      !body.time ||
      body.latitude === undefined ||
      body.longitude === undefined ||
      !body.timezone
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert date + time to a single JS Date in UTC
    const localDate = new Date(`${body.date}T${body.time}`);
    // Apply timezone offset using the Intl API
    const utcDate = new Date(
      localDate.toLocaleString('en-US', { timeZone: body.timezone })
    );

    // Fetch Panchanga
    const panchanga = await panchang.getPanchanga(
      utcDate,
      body.latitude,
      body.longitude,
      body.timezone
    );

    // Use AstronomicalCalculator to fetch each planet's position
    const calculator = new panchang.AstronomicalCalculator();
    const planetNames: PlanetName[] = [...PLANET_NAMES];

    const planets = await Promise.all(
      planetNames.map(async (planet) => {
        try {
          const pos = await calculator.calculatePlanetPosition(planet, utcDate as Date);
          return { planet, position: pos as PlanetPosition };
        } catch (e) {
          console.warn(`Could not calculate position for ${planet}:`, e);
          return null;
        }
      })
    );

  // Filter out failed calculations
  const filteredPlanets = (planets.filter(Boolean) as Array<{ planet: string; position: PlanetPosition }>);

    const response: KundaliResponse = {
      dateTime: utcDate.toISOString(),
      latitude: body.latitude,
      longitude: body.longitude,
      timezone: body.timezone,
      panchanga,
      planets: filteredPlanets,
    };

    res.status(200).json(response);
  } catch (err: unknown) {
    // Narrow the unknown error to preserve type safety
    console.error(err);
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message || 'Something went wrong' });
  }
}
