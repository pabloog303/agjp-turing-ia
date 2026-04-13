// Punto de entrada del servidor Express
// dotenv.config() debe llamarse ANTES de cualquier import que use process.env
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const authRoutes   = require('./src/routes/auth.routes');
const prodRoutes   = require('./src/routes/productos.routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Seguridad HTTP headers ────────────────────────────────────────────────
app.use(helmet());

// ── CORS — solo origen del frontend ──────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate limiting global (100 req / 15 min por IP) ───────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intenta más tarde' },
});
app.use(globalLimiter);

// ── Rate limiting estricto para login (10 intentos / 15 min) ─────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de login, intenta en 15 minutos' },
});

// ── Body parser ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ── Rutas ─────────────────────────────────────────────────────────────────
app.use('/api/auth',      loginLimiter, authRoutes);
app.use('/api/productos', prodRoutes);

// ── Error handler — debe ir AL FINAL ─────────────────────────────────────
app.use(errorHandler);

// Separamos listen para que los tests puedan importar app sin iniciar el servidor
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
