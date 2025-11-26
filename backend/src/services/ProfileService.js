// backend/src/services/ProfileService.js
const Profile = require('../models/Profile');

async function createOrUpdateProfile(userId, data) {
  const uid = String(userId);

  let profile = await Profile.findOne({ user_id: uid });

  if (!profile) {
    profile = new Profile({ ...data, user_id: uid });
  } else {
    Object.assign(profile, data);
  }

  await profile.save();
  return profile;
}

async function getProfileByUserId(userId) {
  const uid = String(userId);
  return Profile.findOne({ user_id: uid });
}

module.exports = { createOrUpdateProfile, getProfileByUserId };
