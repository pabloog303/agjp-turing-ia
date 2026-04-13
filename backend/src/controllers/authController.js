// Controlador de autenticación — login con JWT
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Valida que ambos campos estén presentes y tengan formato básico
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password requeridos' });
    }
    if (typeof email !== 'string' || !email.includes('@') || email.length > 254) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return res.status(400).json({ error: 'Password debe tener entre 6 y 128 caracteres' });
    }

    // Busca el usuario por email
    const [rows] = await pool.query(
      'SELECT id, nombre, email, password_hash, role_id FROM usuarios WHERE email = ?',
      [email]
    );

    const usuario = rows[0];

    // Mismo mensaje para email inexistente o password incorrecta — evita enumerar usuarios
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Compara la password enviada con el hash almacenado
    const coincide = await bcrypt.compare(password, usuario.password_hash);
    if (!coincide) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Genera el JWT con payload mínimo y expiración de 8 horas
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role_id: usuario.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Retorna token y datos públicos del usuario (sin el hash)
    return res.json({
      token,
      user: {
        id:      usuario.id,
        nombre:  usuario.nombre,
        email:   usuario.email,
        role_id: usuario.role_id
      }
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { login };
