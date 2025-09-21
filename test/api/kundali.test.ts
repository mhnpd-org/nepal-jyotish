import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../src/pages/api/kundali';

describe('Kundali API', () => {
  it('returns 400 when required fields are missing', async () => {
    const { req, res } = createMocks({ method: 'POST', body: {} });
    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
    expect(res._getStatusCode()).toBe(400);
    const json = JSON.parse(res._getData());
    expect(json).toHaveProperty('error');
  });

  it('returns 200 and panchanga on valid POST', async () => {
    const body = {
      date: '2025-09-21',
      time: '12:00:00',
      latitude: 27.7172,
      longitude: 85.3240,
      timezone: 'Asia/Kathmandu',
    };
    const { req, res } = createMocks({ method: 'POST', body });
    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
    expect(res._getStatusCode()).toBe(200);
    const json = JSON.parse(res._getData());
    expect(json).toHaveProperty('panchanga');
    expect(json).toMatchObject({ latitude: body.latitude, longitude: body.longitude, timezone: body.timezone });
  });
});
