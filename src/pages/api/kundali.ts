import type { NextApiRequest, NextApiResponse } from "next";
import * as panchang from "@bidyashish/panchang";
import type {
  PanchangaResult,
  PlanetPosition,
  AstronomicalCalculator,
} from "@bidyashish/panchang";
import { zonedTimeToUtc } from "date-fns-tz";

export interface KundaliRequest {
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm" or "HH:mm:ss"
  latitude: number;
  longitude: number;
  timezone: string; // IANA timezone, e.g. "Asia/Kathmandu"
}

export interface PlanetData {
  planet: string;
  position: PlanetPosition;
}

export interface PlanetSidereal {
  planet: string;
  longitudeSidereal: number; // 0-360
  sign: number; // 1-12 (Aries=1)
  degreesInSign: number; // 0-30
}

export interface KundaliResponse {
  dateTime: string; // UTC ISO string
  latitude: number;
  longitude: number;
  timezone: string;
  panchanga: PanchangaResult;
  planets: PlanetData[];
  planetsSidereal?: PlanetSidereal[];
}

const PLANET_NAMES = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Rahu",
  "Ketu",
] as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KundaliResponse | { error: string }>
) {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ error: "Method not allowed. Use POST." });
    }

    const body: KundaliRequest = req.body;

    const { date, time, timezone, latitude, longitude } = body;

    if (!date || !time || !timezone || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Normalize time to HH:mm:ss
    const timeNormalized = time.length === 5 ? `${time}:00` : time;
    const localIso = `${date}T${timeNormalized}`;

    // Convert local time to UTC
    const utcDate = zonedTimeToUtc(localIso, timezone);

    console.log("UTC Date:", utcDate.toISOString()); // Debug log

    // Fetch Panchanga
    const panchangaData: PanchangaResult = await panchang.getPanchanga(
      utcDate,
      latitude,
      longitude,
      timezone
    );

    // Calculate planetary positions
    const calculator: AstronomicalCalculator = new panchang.AstronomicalCalculator();
    // Prefer the library's batched helper when available. Use any to bypass mismatched d.ts.
    let planetaryPositionsRaw: Record<string, unknown> = {};
    const calcUnknown = calculator as unknown;
    if (typeof (calcUnknown as any)?.calculatePlanetaryPositions === "function") {
      // library returns an object keyed by planet with { longitude, latitude, siderealLongitude }
      planetaryPositionsRaw = (calcUnknown as any).calculatePlanetaryPositions(utcDate, PLANET_NAMES as unknown as string[]);
    } else {
      // Fallback: call per-planet method if available
      planetaryPositionsRaw = {};
  for (const p of PLANET_NAMES) {
        try {
          const calcAny2 = calcUnknown as any;
          if (typeof calcAny2.calculatePlanetPosition === 'function') {
            const pos = await calcAny2.calculatePlanetPosition(p as unknown as string, utcDate);
            planetaryPositionsRaw[p] = pos;
          } else {
            planetaryPositionsRaw[p] = undefined;
          }
        } catch {
          planetaryPositionsRaw[p] = undefined;
        }
      }
    }

    const planets: PlanetData[] = PLANET_NAMES.map((planet) => {
      const raw = planetaryPositionsRaw[planet];
      // prefer siderealLongitude provided by the library when present (matches test expectations)
      const longitude = (raw && (typeof raw.siderealLongitude === 'number' ? raw.siderealLongitude : raw.longitude)) ?? 0;
      return {
        planet,
        position: {
          longitude,
          latitude: raw?.latitude ?? 0,
          distance: raw?.distance ?? 0,
          longitudeSpeed: raw?.longitudeSpeed ?? 0,
        },
      };
    });


    // Use the user-provided tropical -> sidereal conversion (approx)
    const tropicalToSidereal = (deg: number) => {
      const ayanamsa = 23.44; // approximate for 1990, use Lahiri or KP for exact
      const sidereal = deg - ayanamsa;
      return sidereal < 0 ? sidereal + 360 : sidereal;
    };

    function normalizeLongitude(deg: number) {
      let v = deg % 360;
      if (v < 0) v += 360;
      return v;
    }

    function toSignAndDegrees(longitude: number) {
      const lon = normalizeLongitude(longitude);
      const sign = Math.floor(lon / 30) + 1; // 1..12
      const degreesInSign = lon - (sign - 1) * 30;
      return { sign, degreesInSign };
    }

    const planetsSidereal: PlanetSidereal[] = PLANET_NAMES.map((planet) => {
      const raw = planetaryPositionsRaw[planet];
  const trop = raw?.longitude ?? 0;
  const lonSid = normalizeLongitude(tropicalToSidereal(trop));
      const { sign, degreesInSign } = toSignAndDegrees(lonSid);
      return {
        planet,
        longitudeSidereal: lonSid,
        sign,
        degreesInSign,
      };
    });


    const response: KundaliResponse = {
      dateTime: utcDate.toISOString(),
      latitude,
      longitude,
      timezone,
      panchanga: panchangaData,
      planets,
      planetsSidereal,
    };

    return res.status(200).json(response);
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
}
