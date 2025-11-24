const request = require('supertest');
const app = require('../app');
const UserFactory = require('../factories/userFactory');
const ProfileFactory = require('../factories/profileFactory');
const TestHelpers = require('../utils/testHelpers');

describe('Profile API', () => {
  let authenticatedUser;
  let authToken;

  beforeEach(async () => {
    const authData = await TestHelpers.createAuthenticatedUser();
    authenticatedUser = authData.user;
    authToken = authData.token;
  });

  describe('POST /profile', () => {
    it('should create a new profile with valid data', async () => {
      const profileData = ProfileFactory.generateProfileData();

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(201);

      expect(response.body).toHaveProperty('profile');
      expect(response.body.profile.user_id).toBe(authenticatedUser.user_id);
      expect(response.body.profile.age).toBe(profileData.age);
      expect(response.body.profile.gender).toBe(profileData.gender);
      expect(response.body.profile.height).toBe(profileData.height);
      expect(response.body.profile.weight).toBe(profileData.weight);
      expect(response.body.profile.activity_level).toBe(profileData.activity_level);
      expect(response.body).toHaveProperty('message', 'Profile saved successfully');
    });

    it('should update existing profile', async () => {
      // Create initial profile
      const initialProfile = ProfileFactory.generateProfileData({
        age: 25,
        weight: 70
      });

      await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(initialProfile)
        .expect(201);

      // Update profile
      const updatedProfile = ProfileFactory.generateProfileData({
        age: 26,
        weight: 72
      });

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedProfile)
        .expect(200);

      expect(response.body.profile.age).toBe(26);
      expect(response.body.profile.weight).toBe(72);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
    });

    it('should return error for invalid age', async () => {
      const profileData = ProfileFactory.generateProfileData({
        age: -5
      });

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400);
    });

    it('should return error for invalid gender', async () => {
      const profileData = ProfileFactory.generateProfileData({
        gender: 'invalid'
      });

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400);
    });

    it('should return error for invalid height', async () => {
      const profileData = ProfileFactory.generateProfileData({
        height: -175
      });

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400);
    });

    it('should return error for invalid weight', async () => {
      const profileData = ProfileFactory.generateProfileData({
        weight: -70
      });

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400);
    });

    it('should return error for invalid activity level', async () => {
      const profileData = ProfileFactory.generateProfileData({
        activity_level: 'invalid'
      });

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400);
    });

    it('should return error without authentication', async () => {
      const profileData = ProfileFactory.generateProfileData();

      const response = await request(app)
        .post('/profile')
        .send(profileData)
        .expect(401);

      TestHelpers.assertErrorResponse(response, 401);
    });

    it('should return error with invalid token', async () => {
      const profileData = ProfileFactory.generateProfileData();

      const response = await request(app)
        .post('/profile')
        .set('Authorization', 'Bearer invalid-token')
        .send(profileData)
        .expect(401);

      TestHelpers.assertErrorResponse(response, 401);
    });

    it('should return error with expired token', async () => {
      const expiredToken = TestHelpers.generateExpiredToken(authenticatedUser.user_id);
      const profileData = ProfileFactory.generateProfileData();

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send(profileData)
        .expect(401);

      TestHelpers.assertErrorResponse(response, 401);
    });
  });

  describe('Profile Validation Edge Cases', () => {
    it('should handle all valid activity levels', async () => {
      const activityLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];

      for (const activityLevel of activityLevels) {
        const profileData = ProfileFactory.generateProfileData({
          activity_level: activityLevel
        });

        const response = await request(app)
          .post('/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send(profileData)
          .expect(201);

        expect(response.body.profile.activity_level).toBe(activityLevel);

        // Clean up for next iteration
        await TestHelpers.wait(100);
      }
    });

    it('should handle both genders', async () => {
      const genders = ['male', 'female'];

      for (const gender of genders) {
        const profileData = ProfileFactory.generateProfileData({
          gender: gender
        });

        const response = await request(app)
          .post('/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send(profileData)
          .expect(201);

        expect(response.body.profile.gender).toBe(gender);

        // Clean up for next iteration
        await TestHelpers.wait(100);
      }
    });

    it('should handle boundary values', async () => {
      const boundaryProfile = ProfileFactory.generateProfileData({
        age: 18,
        height: 100.0,
        weight: 30.0
      });

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(boundaryProfile)
        .expect(201);

      expect(response.body.profile.age).toBe(18);
      expect(response.body.profile.height).toBe(100.0);
      expect(response.body.profile.weight).toBe(30.0);
    });
  });
});