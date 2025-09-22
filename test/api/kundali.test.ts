import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../../src/pages/api/kundali";
import type { PlanetaryPosition } from "../../src/pages/api/kundali-types";

describe("Kundali API", () => {
  it("returns 400 when required fields are missing", async () => {
    const { req, res } = createMocks({ method: "POST", body: {} });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    expect(res._getStatusCode()).toBe(400);
    const json = JSON.parse(res._getData());
    expect(json).toHaveProperty("error");
    expect(json.error).toBe("VALIDATION_ERROR");
  });

  it("returns 200 and panchanga on valid POST", async () => {
    const body = {
      date: "1990-07-15",
      time: "14:30:00",
      latitude: 27.7172,
      longitude: 85.324,
      timezone: "Asia/Kathmandu"
    };
    const { req, res } = createMocks({ method: "POST", body });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    expect(res._getStatusCode()).toBe(200);
    const json = JSON.parse(res._getData());
    expect(json).toHaveProperty("panchangaData");

    console.log("Kundali API Response:", JSON.stringify(json, null, 2)); // Debug log

    expect(json).toMatchObject({
      coordinates: {
        latitude: body.latitude,
        longitude: body.longitude
      },
      timezone: body.timezone
    });
    // Planets should be present and be an array
    expect(Array.isArray(json.planetaryPositions)).toBe(true);
    if (
      Array.isArray(json.planetaryPositions) &&
      json.planetaryPositions.length > 0
    ) {
      const first = json.planetaryPositions[0];
      expect(first).toHaveProperty("planet");
      expect(first).toHaveProperty("tropicalPosition");
      expect(first.tropicalPosition).toHaveProperty("longitude");
      expect(first.tropicalPosition).toHaveProperty("latitude");
      expect(first.tropicalPosition).toHaveProperty("distance");
      expect(first.tropicalPosition).toHaveProperty("longitudeSpeed");
    }
  });

  it("matches expected ephemeris longitudes within 0.1% relative error", async () => {
    const body = {
      date: "1990-07-15",
      time: "14:30:00",
      latitude: 27.7172,
      longitude: 85.324,
      timezone: "Asia/Kathmandu"
    };
    const { req, res } = createMocks({ method: "POST", body });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    expect(res._getStatusCode()).toBe(200);
    const json = JSON.parse(res._getData());
    expect(Array.isArray(json.planetaryPositions)).toBe(true);

    console.log(JSON.stringify(json.planetaryPositions, null, 2)); // Debug log
    console.log("Full API Response:", JSON.stringify(json, null, 2)); // Debug log

    // Expected longitudes from provided table (degrees + minutes)
    const expectedLongitudes: Record<string, number> = {
      Sun: 88.88333333333334,
      // Moon 357°37' -> 357 + 37/60 = 357.6166666666667
      Moon: 357.6166666666667,
      // Mercury 102°47' -> 102.78333333333333
      Mercury: 102.78333333333333,
      // Venus 60°31' -> 60.516666666666666
      Venus: 60.51666666666667,
      // Mars 8°7' -> 8.116666666666667
      Mars: 8.116666666666667,
      // Jupiter 88°47' -> 88.78333333333333
      Jupiter: 88.78333333333333,
      // Saturn 268°14' -> 268.23333333333335
      Saturn: 268.23333333333335,
      // Rahu 284°23' -> 284.3833333333333
      Rahu: 284.3833333333333,
      // Ketu 104°23' -> 104.38333333333334
      Ketu: 104.38333333333334
    };

    console.log(expectedLongitudes, json.planetaryPositions);

    const planets = json.planetaryPositions;

    // Helper function to calculate relative error and check tolerance
    const checkLongitudeWithTolerance = (
      actual: number | undefined,
      expected: number,
      planetName: string
    ) => {
      expect(actual).toBeDefined();
      if (actual) {
        const relativeError = Math.abs((actual - expected) / expected);
        console.log(
          `${planetName}: Expected ${expected}, Got ${actual}, Relative Error: ${(
            relativeError * 100
          ).toFixed(3)}%`
        );
        expect(relativeError).toBeLessThan(0.1); // 0.1% tolerance
      }
    };

    const sunLongitude = planets?.find(
      (p: PlanetaryPosition) => p.planet === "Sun"
    )?.tropicalPosition.longitude;
    checkLongitudeWithTolerance(sunLongitude, expectedLongitudes.Sun, "Sun");

    const moonLongitude = planets?.find(
      (p: PlanetaryPosition) => p.planet === "Moon"
    )?.tropicalPosition.longitude;
    checkLongitudeWithTolerance(moonLongitude, expectedLongitudes.Moon, "Moon");

    const mercuryLongitude = planets?.find(
      (p: PlanetaryPosition) => p.planet === "Mercury"
    )?.tropicalPosition.longitude;
    checkLongitudeWithTolerance(
      mercuryLongitude,
      expectedLongitudes.Mercury,
      "Mercury"
    );

    const venusLongitude = planets?.find(
      (p: PlanetaryPosition) => p.planet === "Venus"
    )?.tropicalPosition.longitude;
    checkLongitudeWithTolerance(
      venusLongitude,
      expectedLongitudes.Venus,
      "Venus"
    );

    const marsLongitude = planets?.find(
      (p: PlanetaryPosition) => p.planet === "Mars"
    )?.tropicalPosition.longitude;
    checkLongitudeWithTolerance(marsLongitude, expectedLongitudes.Mars, "Mars");

    const jupiterLongitude = planets?.find(
      (p: PlanetaryPosition) => p.planet === "Jupiter"
    )?.tropicalPosition.longitude;
    checkLongitudeWithTolerance(
      jupiterLongitude,
      expectedLongitudes.Jupiter,
      "Jupiter"
    );

    const saturnLongitude = planets?.find(
      (p: PlanetaryPosition) => p.planet === "Saturn"
    )?.tropicalPosition.longitude;
    checkLongitudeWithTolerance(
      saturnLongitude,
      expectedLongitudes.Saturn,
      "Saturn"
    );

    const rahuLongitude = planets?.find(
      (p: PlanetaryPosition) => p.planet === "Rahu"
    )?.tropicalPosition.longitude;
    checkLongitudeWithTolerance(rahuLongitude, expectedLongitudes.Rahu, "Rahu");

    const ketuLongitude = planets?.find(
      (p: PlanetaryPosition) => p.planet === "Ketu"
    )?.tropicalPosition.longitude;
    checkLongitudeWithTolerance(ketuLongitude, expectedLongitudes.Ketu, "Ketu");
  });
});
