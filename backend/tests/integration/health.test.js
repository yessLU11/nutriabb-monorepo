const request = require('supertest');
const app = require('../app');

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      environment: 'test'
    });
  });

  it('should have test environment configured', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.DB_NAME).toBe('nutriabb_test');
  });
});