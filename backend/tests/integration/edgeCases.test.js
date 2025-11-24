const request = require('supertest');
const app = require('../app');
const UserFactory = require('../factories/userFactory');
const ProfileFactory = require('../factories/profileFactory');
const TestHelpers = require('../utils/testHelpers');

describe('Edge Cases and Error Scenarios', () => {
  let authenticatedUser;
  let authToken;

  beforeEach(async () => {
    const authData = await TestHelpers.createAuthenticatedUser();
    authenticatedUser = authData.user;
    authToken = authData.token;
  });

  describe('Boundary Value Testing', () => {
    it('should handle minimum valid values', async () => {
      const minProfile = ProfileFactory.generateProfileData({
        age: 1,
        height: 1.0,
        weight: 1.0
      });

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(minProfile)
        .expect(201);

      expect(response.body.profile.age).toBe(1);
      expect(response.body.profile.height).toBe(1.0);
      expect(response.body.profile.weight).toBe(1.0);
    });

    it('should handle maximum reasonable values', async () => {
      const maxProfile = ProfileFactory.generateProfileData({
        age: 120,
        height: 300.0,
        weight: 500.0
      });

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(maxProfile)
        .expect(201);

      expect(response.body.profile.age).toBe(120);
      expect(response.body.profile.height).toBe(300.0);
      expect(response.body.profile.weight).toBe(500.0);
    });

    it('should calculate nutrition for extreme but valid profiles', async () => {
      // Very tall, heavy, young, active person
      const extremeProfile = ProfileFactory.generateProfileData({
        age: 18,
        gender: 'male',
        height: 220.0,
        weight: 150.0,
        activity_level: 'very_active'
      });

      await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(extremeProfile)
        .expect(201);

      const response = await request(app)
        .get('/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Should have very high calorie needs
      expect(response.body.calories).toBeGreaterThan(4000);
      expect(response.body.macros.carbohydrates).toBeGreaterThan(0);
      expect(response.body.macros.proteins).toBeGreaterThan(0);
      expect(response.body.macros.fats).toBeGreaterThan(0);
    });

    it('should calculate nutrition for small elderly person', async () => {
      // Small, elderly, sedentary person
      const smallProfile = ProfileFactory.generateProfileData({
        age: 80,
        gender: 'female',
        height: 140.0,
        weight: 40.0,
        activity_level: 'sedentary'
      });

      await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(smallProfile)
        .expect(201);

      const response = await request(app)
        .get('/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Should have lower calorie needs
      expect(response.body.calories).toBeLessThan(1500);
      expect(response.body.calories).toBeGreaterThan(800); // Still reasonable minimum
    });
  });

  describe('Data Type and Format Testing', () => {
    it('should handle decimal precision correctly', async () => {
      const preciseProfile = ProfileFactory.generateProfileData({
        height: 175.75,
        weight: 70.25
      });

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(preciseProfile)
        .expect(201);

      expect(response.body.profile.height).toBe(175.75);
      expect(response.body.profile.weight).toBe(70.25);
    });

    it('should reject non-numeric values for numeric fields', async () => {
      const invalidTypes = [
        { age: 'twenty-five', gender: 'male', height: 175, weight: 70, activity_level: 'moderate' },
        { age: 25, gender: 'male', height: 'tall', weight: 70, activity_level: 'moderate' },
        { age: 25, gender: 'male', height: 175, weight: 'heavy', activity_level: 'moderate' },
        { age: null, gender: 'male', height: 175, weight: 70, activity_level: 'moderate' },
        { age: undefined, gender: 'male', height: 175, weight: 70, activity_level: 'moderate' }
      ];

      for (const invalidProfile of invalidTypes) {
        const response = await request(app)
          .post('/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send(invalidProfile)
          .expect(400);

        TestHelpers.assertErrorResponse(response, 400);
      }
    });

    it('should handle missing required fields', async () => {
      const incompleteProfiles = [
        { gender: 'male', height: 175, weight: 70, activity_level: 'moderate' }, // missing age
        { age: 25, height: 175, weight: 70, activity_level: 'moderate' }, // missing gender
        { age: 25, gender: 'male', weight: 70, activity_level: 'moderate' }, // missing height
        { age: 25, gender: 'male', height: 175, activity_level: 'moderate' }, // missing weight
        { age: 25, gender: 'male', height: 175, weight: 70 } // missing activity_level
      ];

      for (const incompleteProfile of incompleteProfiles) {
        const response = await request(app)
          .post('/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send(incompleteProfile)
          .expect(400);

        TestHelpers.assertErrorResponse(response, 400);
      }
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent profile updates', async () => {
      const profile1 = ProfileFactory.generateProfileData({ age: 25 });
      const profile2 = ProfileFactory.generateProfileData({ age: 26 });

      // Make concurrent requests
      const [response1, response2] = await Promise.all([
        request(app)
          .post('/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send(profile1),
        request(app)
          .post('/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send(profile2)
      ]);

      // Both should succeed, but the last one should win
      expect([200, 201]).toContain(response1.status);
      expect([200, 201]).toContain(response2.status);
    });

    it('should handle concurrent calculations', async () => {
      // Create a profile first
      const profileData = ProfileFactory.generateProfileData();
      await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(201);

      // Make concurrent calculation requests
      const promises = Array(3).fill().map(() =>
        request(app)
          .get('/calculate')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(promises);

      // All should succeed and return the same results
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('calories');
      });

      // Results should be identical
      const firstResult = responses[0].body;
      responses.slice(1).forEach(response => {
        expect(response.body.calories).toBe(firstResult.calories);
      });
    });
  });

  describe('Memory and Performance', () => {
    it('should handle large number of sequential requests', async () => {
      const profileData = ProfileFactory.generateProfileData();
      
      // Create profile first
      await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(201);

      // Make many sequential calculation requests
      for (let i = 0; i < 10; i++) {
        const response = await request(app)
          .get('/calculate')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('calories');
      }
    });

    it('should handle requests with large payloads', async () => {
      // Create profile with extra fields that should be ignored
      const profileWithExtraData = {
        ...ProfileFactory.generateProfileData(),
        extraField1: 'a'.repeat(1000),
        extraField2: { nested: { data: 'test' } },
        extraField3: [1, 2, 3, 4, 5]
      };

      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileWithExtraData)
        .expect(201);

      // Should only save the valid fields
      expect(response.body.profile).not.toHaveProperty('extraField1');
      expect(response.body.profile).not.toHaveProperty('extraField2');
      expect(response.body.profile).not.toHaveProperty('extraField3');
    });
  });

  describe('Network and Timeout Scenarios', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400);
    });

    it('should handle empty request body', async () => {
      const response = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send()
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400);
    });

    it('should handle very long email addresses', async () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: longEmail,
          password: 'validpassword123'
        })
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400);
    });
  });

  describe('Database Constraint Testing', () => {
    it('should enforce unique email constraint', async () => {
      const userData = UserFactory.generateUserData();
      
      // Register first user
      await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(409);

      TestHelpers.assertErrorResponse(response, 409, 'Email already exists');
    });

    it('should handle profile updates correctly', async () => {
      const initialProfile = ProfileFactory.generateProfileData({
        age: 25,
        weight: 70
      });

      // Create initial profile
      const createResponse = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(initialProfile)
        .expect(201);

      const profileId = createResponse.body.profile.profile_id;

      // Update profile
      const updatedProfile = ProfileFactory.generateProfileData({
        age: 26,
        weight: 72
      });

      const updateResponse = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedProfile)
        .expect(200);

      // Should be the same profile ID (updated, not created new)
      expect(updateResponse.body.profile.profile_id).toBe(profileId);
      expect(updateResponse.body.profile.age).toBe(26);
      expect(updateResponse.body.profile.weight).toBe(72);
    });
  });
});