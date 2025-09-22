import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handler, { KundaliResponse } from "../../src/pages/api/kundali";
import { PlanetPosition } from "@bidyashish/panchang";

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
    expect(json).toHaveProperty("panchanga");

    console.log("Kundali API Response:", JSON.stringify(json, null, 2)); // Debug log

    expect(json).toMatchObject({
      latitude: body.latitude,
      longitude: body.longitude,
      timezone: body.timezone
    });
    // Planets should be present and be an array
    expect(Array.isArray(json.planets)).toBe(true);
    if (Array.isArray(json.planets) && json.planets.length > 0) {
      const first = json.planets[0];
      expect(first).toHaveProperty("planet");
      expect(first).toHaveProperty("position");
      expect(first.position).toHaveProperty("longitude");
      expect(first.position).toHaveProperty("latitude");
      expect(first.position).toHaveProperty("distance");
      expect(first.position).toHaveProperty("longitudeSpeed");
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
    expect(Array.isArray(json.planets)).toBe(true);



    console.log(JSON.stringify(json.planets, null, 2)); // Debug log
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

    const response = json as KundaliResponse
    const planets = response.planets
    
    const sunLongitude = planets?.find(p => p.planet === 'Sun')?.position.longitude;
    expect(sunLongitude).toEqual(expectedLongitudes.Sun);

    const moonLongitude = planets?.find(p => p.planet === 'Moon')?.position.longitude;
    expect(moonLongitude).toEqual(expectedLongitudes.Moon);

    const mercuryLongitude = planets?.find(p => p.planet === 'Mercury')?.position.longitude;
    expect(mercuryLongitude).toEqual(expectedLongitudes.Mercury);
    
    const venusLongitude = planets?.find(p => p.planet === 'Venus')?.position.longitude;
    expect(venusLongitude).toEqual(expectedLongitudes.Venus);

    const marsLongitude = planets?.find(p => p.planet === 'Mars')?.position.longitude;
    expect(marsLongitude).toEqual(expectedLongitudes.Mars);

    const jupiterLongitude = planets?.find(p => p.planet === 'Jupiter')?.position.longitude;
    expect(jupiterLongitude).toEqual(expectedLongitudes.Jupiter);

    const saturnLongitude = planets?.find(p => p.planet === 'Saturn')?.position.longitude;
    expect(saturnLongitude).toEqual(expectedLongitudes.Saturn);
    
    const rahuLongitude = planets?.find(p => p.planet === 'Rahu')?.position.longitude;
    expect(rahuLongitude).toEqual(expectedLongitudes.Rahu); 

    const ketuLongitude = planets?.find(p => p.planet === 'Ketu')?.position.longitude;
    expect(ketuLongitude).toEqual(expectedLongitudes.Ketu);
    
  });
});
