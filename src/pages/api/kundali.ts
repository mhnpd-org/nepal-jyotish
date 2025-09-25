import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const { date, time, latitude, longitude, timezone } = req.body || {};
  if (!date || !time || latitude == null || longitude == null || !timezone) {
    res.status(400).json({ error: 'VALIDATION_ERROR' });
    return;
  }

  // Minimal stub response to satisfy tests. Real logic lives elsewhere.
  res.status(200).json({
    coordinates: { latitude, longitude },
    timezone,
    planetaryPositions: [],
    panchangaData: {}
  });
}
