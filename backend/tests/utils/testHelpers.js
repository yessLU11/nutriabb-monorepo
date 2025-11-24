const jwt = require('jsonwebtoken');
const UserFactory = require('../factories/userFactory');

class TestHelpers {
  /**
   * Create a user and return authentication token
   */
  static async createAuthenticatedUser(userData = {}) {
    const user = await UserFactory.create(userData);
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );
    
    return { user, token };
  }

  /**
   * Generate JWT token for a user ID
   */
  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );
  }

  /**
   * Generate invalid JWT token
   */
  static generateInvalidToken() {
    return 'invalid.jwt.token';
  }

  /**
   * Generate expired JWT token
   */
  static generateExpiredToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '-1h' } // Already expired
    );
  }

  /**
   * Extract error message from response
   */
  static extractErrorMessage(response) {
    return response.body?.error?.message || response.body?.message || 'Unknown error';
  }

  /**
   * Assert response structure for success
   */
  static assertSuccessResponse(response, expectedStatus = 200) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toBeDefined();
  }

  /**
   * Assert response structure for error
   */
  static assertErrorResponse(response, expectedStatus, expectedMessage = null) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('message');
    
    if (expectedMessage) {
      expect(response.body.error.message).toContain(expectedMessage);
    }
  }

  /**
   * Wait for a specified amount of time
   */
  static async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = TestHelpers;