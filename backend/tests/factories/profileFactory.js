const ProfileRepository = require('../../src/repositories/ProfileRepository');

class ProfileFactory {
  static async create(userId, overrides = {}) {
    const defaultProfile = {
      age: 25,
      gender: 'male',
      height: 175.0,
      weight: 70.0,
      activity_level: 'moderate'
    };

    const profileData = { ...defaultProfile, ...overrides };
    
    const profileRepository = new ProfileRepository();
    return await profileRepository.create(userId, profileData);
  }

  static generateProfileData(overrides = {}) {
    return {
      age: 25,
      gender: 'male',
      height: 175.0,
      weight: 70.0,
      activity_level: 'moderate',
      ...overrides
    };
  }

  static generateInvalidProfileData() {
    return [
      { age: -5, gender: 'male', height: 175, weight: 70, activity_level: 'moderate' },
      { age: 25, gender: 'invalid', height: 175, weight: 70, activity_level: 'moderate' },
      { age: 25, gender: 'male', height: -175, weight: 70, activity_level: 'moderate' },
      { age: 25, gender: 'male', height: 175, weight: -70, activity_level: 'moderate' },
      { age: 25, gender: 'male', height: 175, weight: 70, activity_level: 'invalid' }
    ];
  }
}

module.exports = ProfileFactory;