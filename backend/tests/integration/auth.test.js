const request = require('supertest');
const app = require('../app');
const UserFactory = require('../factories/userFactory');
const TestHelpers = require('../utils/testHelpers');

describe('Authentication API', () => {
  describe('POST /auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = UserFactory.generateUserData();

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('user_id');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user).not.toHaveProperty('password_hash');
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should return error for duplicate email', async () => {
      const userData = UserFactory.generateUserData();
      
      // Create user first
      await UserFactory.create(userData);

      // Try to register with same email
      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(409);

      TestHelpers.assertErrorResponse(response, 409, 'Email already exists');
    });

    it('should return error for invalid email format', async () => {
      const userData = UserFactory.generateUserData({
        email: 'invalid-email'
      });

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400);
    });

    it('should return error for weak password', async () => {
      const userData = UserFactory.generateUserData({
        password: '123'
      });

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400);
    });

    it('should return error for missing required fields', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({})
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400);
    });
  });

  describe('POST /auth/login', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await UserFactory.create();
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user).not.toHaveProperty('password_hash');
      expect(typeof response.body.data.token).toBe('string');
    });

    it('should return error for invalid email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        })
        .expect(401);

      TestHelpers.assertErrorResponse(response, 401, 'Invalid credentials');
    });

    it('should return error for invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      TestHelpers.assertErrorResponse(response, 401, 'Invalid credentials');
    });

    it('should return error for missing credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({})
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400);
    });
  });

  describe('Authentication Flow', () => {
    it('should complete full registration and login flow', async () => {
      const userData = UserFactory.generateUserData();

      // Register user
      const registerResponse = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.data.user.email).toBe(userData.email);

      // Login with registered user
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(loginResponse.body.data.user.user_id).toBe(registerResponse.body.data.user.user_id);
      expect(loginResponse.body.data).toHaveProperty('token');
    });
  });
});