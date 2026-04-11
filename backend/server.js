// Punto de entrada del servidor Express
// dotenv.config() debe llamarse ANTES de cualquier import que use process.env
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const authRoutes   = require('./src/routes/auth.routes');
const prodRoutes   = require('./src/routes/productos.routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3001;

// Permite requests solo desde el origen del frontend configurado
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

// Parsea el body de los requests como JSON
app.use(express.json());

// Monta las rutas bajo el prefijo /api
app.use('/api/auth',      authRoutes);
app.use('/api/productos', prodRoutes);

// Middleware de errores — debe ir AL FINAL, después de todas las rutas
app.use(errorHandler);

// Separamos listen para que los tests puedan importar app sin iniciar el servidor
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
