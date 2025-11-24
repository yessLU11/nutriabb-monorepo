require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));



// ✅ Importar rutas correctamente usando path.join
const authRoutes = require(path.join(__dirname, 'routes', 'authRoutes'));
const profileRoutes = require(path.join(__dirname, 'routes', 'profileRoutes'));
const nutritionRoutes = require(path.join(__dirname, 'routes', 'nutritionRoutes'));

// Import error handling middleware
const { globalErrorHandler, notFoundHandler } = require('./middleware/errorHandler');


// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Nutriabb MVP API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/calculate', nutritionRoutes);

// Handle 404 errors for unmatched routes
app.use(notFoundHandler);

// Global error handler (must be last middleware)
app.use(globalErrorHandler);



// Debug: list all registered routes after they are mounted
app.on('mount', () => {
  console.log("📜 Registered routes (on mount):");
  app._router.stack
    .filter(r => r.route)
    .forEach(r => console.log(Object.keys(r.route.methods)[0].toUpperCase(), r.route.path));
});

setTimeout(() => {
  if (app._router && app._router.stack) {
    console.log("📜 Registered routes:");
    app._router.stack
      .filter(r => r.route)
      .forEach(r => console.log(Object.keys(r.route.methods)[0].toUpperCase(), r.route.path));
  } else {
    console.log("⚠️ No routes found in app._router yet");
  }
}, 500);


// ✅ Mostrar todas las rutas registradas (incluye subrutas)
function listRoutes(app) {
  try {
    if (!app._router || !app._router.stack) {
      console.log("⚠️ No routes found (router not ready yet)");
      return;
    }

    const routes = [];

    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods).map((m) => m.toUpperCase());
        routes.push({ path: middleware.route.path, methods });
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const methods = Object.keys(handler.route.methods).map((m) => m.toUpperCase());
            const base = middleware.regexp.source
              .replace('^\\/', '/')
              .replace('\\/?(?=\\/|$)', '')
              .replace('(?=\\/|$)', '');
            routes.push({ path: `${base}${handler.route.path}`, methods });
          }
        });
      }
    });

    if (routes.length === 0) {
      console.log("⚠️ No routes found in app._router");
    } else {
      console.log("📜 Registered routes:");
      routes.forEach((r) => console.log(`   ${r.methods.join(', ')} ${r.path}`));
    }
  } catch (err) {
    console.error("❌ Error listing routes:", err.message);
  }
}

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Nutriabb MVP server running on port ${PORT}`);
  console.log(`🩺 Health check available at: http://localhost:${PORT}/health`);

  // Esperar un poco para que Express registre todas las rutas
  setTimeout(() => listRoutes(app), 300);
});

module.exports = app;


