const jwt = require("jsonwebtoken");

/**
 * Middleware para autenticar tokens JWT
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: { message: "Authorization header is required", code: "MISSING_AUTH_HEADER" },
        timestamp: new Date().toISOString(),
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: { message: "Authorization header must be: Bearer <token>", code: "INVALID_AUTH_FORMAT" },
        timestamp: new Date().toISOString(),
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        error: { message: "Token is required", code: "MISSING_TOKEN" },
        timestamp: new Date().toISOString(),
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ⬅️ IMPORTANTE: guardar user_id (número) EXACTO
    req.user = { user_id: decoded.userId };
    req.token = token;

    next();

  } catch (error) {
    return res.status(401).json({
      error: {
        message: "Invalid or expired token",
        code: "INVALID_TOKEN",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = {
  authenticateToken
};
