const bcrypt = require('bcrypt');
const UserRepository = require('../../src/repositories/UserRepository');

class UserFactory {
  static async create(overrides = {}) {
    const defaultUser = {
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    const userData = { ...defaultUser, ...overrides };
    
    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 10);
    
    const userRepository = new UserRepository();
    const user = await userRepository.create(userData.email, passwordHash);
    
    // Return user with plain password for testing
    return {
      ...user,
      password: userData.password
    };
  }

  static async createMultiple(count = 3, overrides = {}) {
    const users = [];
    for (let i = 0; i < count; i++) {
      const user = await this.create({
        email: `test${Date.now()}_${i}@example.com`,
        ...overrides
      });
      users.push(user);
    }
    return users;
  }

  static generateUserData(overrides = {}) {
    return {
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      ...overrides
    };
  }
}

module.exports = UserFactory;