// backend/src/services/AuthService.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

class AuthService {
  async register(email, password) {
    email = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email ya registrado');

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ email, passwordHash });
    await user.save();

    const token = this._signToken(user._id.toString());
    return { user: user.toPublic(), token };
  }

  async login(email, password) {
    email = String(email).toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) throw new Error('Usuario o contraseña incorrectos');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Usuario o contraseña incorrectos');

    const token = this._signToken(user._id.toString());
    return { user: user.toPublic(), token };
  }

  _signToken(userId) {
  return jwt.sign({ userId: String(userId) }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
  }


  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // devuelve { id: userId } para compatibilidad con middleware
      return { id: decoded.userId };
    } catch (e) {
      return null;
    }
  }

  refreshToken(oldToken) {
    // validamos y generamos uno nuevo
    const decoded = jwt.verify(oldToken, JWT_SECRET);
    const newToken = this._signToken(decoded.userId);
    return { token: newToken, user: { user_id: decoded.userId } };
  }
}

module.exports = AuthService;
