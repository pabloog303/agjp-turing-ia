// Controlador de productos — CRUD con soft delete
const pool = require('../config/db');

// GET /api/productos — público, retorna solo productos activos
async function getAll(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM productos WHERE activo = 1 ORDER BY created_at DESC'
    );
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}

// POST /api/productos — solo Admin
async function create(req, res, next) {
  try {
    const { nombre, descripcion, precio, categoria, imagen_url, stock } = req.body;

    // Valida campos obligatorios
    if (!nombre || !precio || !categoria) {
      return res.status(400).json({ error: 'nombre, precio y categoria son requeridos' });
    }

    const [result] = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, categoria, imagen_url, stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion || null, precio, categoria, imagen_url || null, stock || 0]
    );

    return res.status(201).json({ message: 'Producto creado', id: result.insertId });
  } catch (err) {
    next(err);
  }
}

// PUT /api/productos/:id — solo Admin, actualiza solo los campos enviados
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const campos = req.body;

    // Construye SET dinámico con solo las claves recibidas
    const keys = Object.keys(campos).filter(k => k !== 'id');
    if (keys.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
    }

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const valores   = keys.map(k => campos[k]);
    valores.push(id);

    const [result] = await pool.query(
      `UPDATE productos SET ${setClause} WHERE id = ? AND activo = 1`,
      valores
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    return res.json({ message: 'Producto actualizado' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/productos/:id — solo Admin, soft delete (activo = 0)
async function softDelete(req, res, next) {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE productos SET activo = 0 WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    return res.json({ message: 'Producto eliminado' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create, update, softDelete };
