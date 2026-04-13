// Middleware global de manejo de errores (4 parámetros obligatorios en Express)
// Debe registrarse al final de server.js, después de todas las rutas

function errorHandler(err, req, res, next) {
  // Siempre loguea el error completo en el servidor
  console.error('Error capturado:', err);

  // JSON inválido en el body (error de parseo de express.json)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido en el body' });
  }

  // Email duplicado en la DB
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }

  // Error de validación manual lanzado desde los controllers
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Error genérico — no expone detalles internos al cliente
  return res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = errorHandler;
