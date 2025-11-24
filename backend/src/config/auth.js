module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_for_development',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  }
};