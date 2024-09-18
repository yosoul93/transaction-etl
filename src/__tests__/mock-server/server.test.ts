import request from 'supertest';
import { app } from '../../mock-server/server';

describe('Mock Server', () => {
  it('should return transactions for valid date range', async () => {
    const response = await request(app)
      .get('/transactions')
      .query({ fromDate: '2024-09-01', toDate: '2024-09-30' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0]).toHaveProperty('date');
    expect(response.body.data[0]).toHaveProperty('amount');
    expect(response.body.data[0]).toHaveProperty('description');
  });

  it('should return 400 for missing date parameters', async () => {
    const response = await request(app)
      .get('/transactions')
      .query({ fromDate: '2024-09-01' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Missing date parameters' });
  });

  it('should return 400 with error message for date range too large', async () => {
    const response = await request(app)
      .get('/transactions')
      .query({ fromDate: '2024-01-01', toDate: '2024-12-31' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Date range too large. Maximum range is 31 days."
    });
  });
});