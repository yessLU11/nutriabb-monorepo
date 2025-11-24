const request = require('supertest');
const app = require('../app');
const UserFactory = require('../factories/userFactory');
const ProfileFactory = require('../factories/profileFactory');
const TestHelpers = require('../utils/testHelpers');

describe('Nutrition Calculator API', () => {
  let authenticatedUser;
  let authToken;

  beforeEach(async () => {
    const authData = await TestHelpers.createAuthenticatedUser();
    authenticatedUser = authData.user;
    authToken = authData.token;
  });

  describe('GET /calculate', () => {
    it('should calculate nutrition for male user with moderate activity', async () => {
      // Create profile for male user
      const profileData = ProfileFactory.generateProfileData({
        age: 25,
        gender: 'male',
        height: 180.0,
        weight: 75.0,
        activity_level: 'moderate'
      });

      await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(201);

      // Get nutrition calculation
      const response = await request(app)
        .get('/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('calories');
      expect(response.body).toHaveProperty('macros');
      expect(response.body).toHaveProperty('percentages');

      // Verify structure
      expect(response.body.macros).toHaveProperty('carbohydrates');
      expect(response.body.macros).toHaveProperty('proteins');
      expect(response.body.macros).toHaveProperty('fats');
      expect(response.body.macros).toHaveProperty('fiber');

      expect(response.body.percentages).toHaveProperty('carbohydrates');
      expect(response.body.percentages).toHaveProperty('proteins');
      expect(response.body.percentages).toHaveProperty('fats');

      // Verify reasonable values for 25-year-old male, 180cm, 75kg, moderate activity
      // Expected BMR ≈ 1728, with moderate activity ≈ 2678 calories
      expect(response.body.calories).toBeGreaterThan(2500);
      expect(response.body.calories).toBeLessThan(2800);

      // Verify macro percentages are within expected ranges
      expect(response.body.percentages.carbohydrates).toBeGreaterThanOrEqual(45);
      expect(response.body.percentages.carbohydrates).toBeLessThanOrEqual(60);
      expect(response.body.percentages.proteins).toBeGreaterThanOrEqual(10);
      expect(response.body.percentages.proteins).toBeLessThanOrEqual(20);
      expect(response.body.percentages.fats).toBeGreaterThanOrEqual(20);
      expect(response.body.percentages.fats).toBeLessThanOrEqual(35);

      // Verify percentages sum to 100
      const totalPercentage = response.body.percentages.carbohydrates + 
                             response.body.percentages.proteins + 
                             response.body.percentages.fats;
      expect(totalPercentage).toBeCloseTo(100, 1);

      // Verify fiber recommendation
      expect(response.body.macros.fiber).toBeGreaterThanOrEqual(25);
      expect(response.body.macros.fiber).toBeLessThanOrEqual(30);
    });

    it('should calculate nutrition for female user with light activity', async () => {
      // Create profile for female user
      const profileData = ProfileFactory.generateProfileData({
        age: 30,
        gender: 'female',
        height: 165.0,
        weight: 60.0,
        activity_level: 'light'
      });

      await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(201);

      // Get nutrition calculation
      const response = await request(app)
        .get('/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Expected BMR ≈ 1372, with light activity ≈ 1886 calories
      expect(response.body.calories).toBeGreaterThan(1800);
      expect(response.body.calories).toBeLessThan(2000);

      // Verify all required fields are present
      expect(response.body).toHaveProperty('calories');
      expect(response.body.macros).toHaveProperty('carbohydrates');
      expect(response.body.macros).toHaveProperty('proteins');
      expect(response.body.macros).toHaveProperty('fats');
      expect(response.body.macros).toHaveProperty('fiber');
    });

    it('should test all activity levels', async () => {
      const activityLevels = [
        { level: 'sedentary', multiplier: 1.2 },
        { level: 'light', multiplier: 1.375 },
        { level: 'moderate', multiplier: 1.55 },
        { level: 'active', multiplier: 1.725 },
        { level: 'very_active', multiplier: 1.9 }
      ];

      const baseProfile = {
        age: 25,
        gender: 'male',
        height: 175.0,
        weight: 70.0
      };

      let previousCalories = 0;

      for (const activity of activityLevels) {
        const profileData = ProfileFactory.generateProfileData({
          ...baseProfile,
          activity_level: activity.level
        });

        await request(app)
          .post('/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send(profileData)
          .expect(201);

        const response = await request(app)
          .get('/calculate')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        // Calories should increase with activity level
        expect(response.body.calories).toBeGreaterThan(previousCalories);
        previousCalories = response.body.calories;

        await TestHelpers.wait(100);
      }
    });

    it('should return error without profile', async () => {
      const response = await request(app)
        .get('/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      TestHelpers.assertErrorResponse(response, 400, 'Profile not found');
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/calculate')
        .expect(401);

      TestHelpers.assertErrorResponse(response, 401);
    });

    it('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/calculate')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      TestHelpers.assertErrorResponse(response, 401);
    });
  });

  describe('Nutrition Calculation Accuracy', () => {
    it('should calculate BMR correctly using Mifflin-St Jeor formula', async () => {
      // Test case: Male, 25 years, 180cm, 75kg
      // Expected BMR = (10 × 75) + (6.25 × 180) - (5 × 25) + 5 = 750 + 1125 - 125 + 5 = 1755
      const profileData = ProfileFactory.generateProfileData({
        age: 25,
        gender: 'male',
        height: 180.0,
        weight: 75.0,
        activity_level: 'sedentary' // BMR × 1.2 = 1755 × 1.2 = 2106
      });

      await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(201);

      const response = await request(app)
        .get('/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Allow for small rounding differences
      expect(response.body.calories).toBeCloseTo(2106, -1); // Within 10 calories
    });

    it('should calculate macros correctly', async () => {
      const profileData = ProfileFactory.generateProfileData({
        age: 30,
        gender: 'female',
        height: 165.0,
        weight: 60.0,
        activity_level: 'moderate'
      });

      await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(201);

      const response = await request(app)
        .get('/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const { calories, macros, percentages } = response.body;

      // Calculate expected macro grams from percentages
      const expectedCarbGrams = (calories * percentages.carbohydrates / 100) / 4;
      const expectedProteinGrams = (calories * percentages.proteins / 100) / 4;
      const expectedFatGrams = (calories * percentages.fats / 100) / 9;

      // Verify macro calculations (allow small rounding differences)
      expect(macros.carbohydrates).toBeCloseTo(expectedCarbGrams, 1);
      expect(macros.proteins).toBeCloseTo(expectedProteinGrams, 1);
      expect(macros.fats).toBeCloseTo(expectedFatGrams, 1);
    });
  });

  describe('Complete User Journey', () => {
    it('should complete full user journey from registration to nutrition calculation', async () => {
      // 1. Register new user
      const userData = UserFactory.generateUserData();
      const registerResponse = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      // 2. Login
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      const token = loginResponse.body.token;

      // 3. Create profile
      const profileData = ProfileFactory.generateProfileData();
      const profileResponse = await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(profileData)
        .expect(201);

      expect(profileResponse.body.profile.user_id).toBe(registerResponse.body.user.user_id);

      // 4. Get nutrition calculation
      const nutritionResponse = await request(app)
        .get('/calculate')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(nutritionResponse.body).toHaveProperty('calories');
      expect(nutritionResponse.body).toHaveProperty('macros');
      expect(nutritionResponse.body).toHaveProperty('percentages');

      // 5. Update profile and recalculate
      const updatedProfileData = ProfileFactory.generateProfileData({
        weight: profileData.weight + 5,
        activity_level: 'active'
      });

      await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedProfileData)
        .expect(200);

      const updatedNutritionResponse = await request(app)
        .get('/calculate')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Calories should be different due to weight and activity level changes
      expect(updatedNutritionResponse.body.calories).not.toBe(nutritionResponse.body.calories);
      expect(updatedNutritionResponse.body.calories).toBeGreaterThan(nutritionResponse.body.calories);
    });
  });
});