import request from 'supertest';
import app from '../src/app';

describe('Health Check API', () => {
  it('should return 200 OK and Server is running message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('message', 'Server is running');
  });
});
