// Middleware que verifica el token JWT en cada ruta protegida
const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
  // Extrae el header Authorization
  const authHeader = req.headers['authorization'];

  // Valida que exista y tenga el formato "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica firma y expiración del token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // adjunta el payload al request para los siguientes middlewares
    next();
  } catch (err) {
    // Distingue entre token expirado y token inválido
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = checkAuth;
