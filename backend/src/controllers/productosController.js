// Controlador de productos — CRUD con soft delete
const pool = require('../config/db');

const CATEGORIAS_VALIDAS = ['Hardware', 'Software', 'Servicios'];

// ── Validador reutilizable ────────────────────────────────────────────────
function validarProducto({ nombre, precio, categoria, stock, imagen_url }) {
  const errores = [];

  if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2)
    errores.push('nombre debe tener al menos 2 caracteres');
  if (nombre && nombre.trim().length > 150)
    errores.push('nombre no puede superar 150 caracteres');

  if (precio === undefined || precio === null || precio === '')
    errores.push('precio es requerido');
  else if (isNaN(Number(precio)) || Number(precio) <= 0)
    errores.push('precio debe ser un número mayor a 0');

  if (!categoria)
    errores.push('categoria es requerida');
  else if (!CATEGORIAS_VALIDAS.includes(categoria))
    errores.push(`categoria debe ser una de: ${CATEGORIAS_VALIDAS.join(', ')}`);

  if (stock !== undefined && stock !== null && stock !== '') {
    if (isNaN(Number(stock)) || Number(stock) < 0 || !Number.isInteger(Number(stock)))
      errores.push('stock debe ser un entero ≥ 0');
  }

  if (imagen_url && typeof imagen_url === 'string' && imagen_url.length > 500)
    errores.push('imagen_url no puede superar 500 caracteres');

  return errores;
}

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

    const errores = validarProducto({ nombre, precio, categoria, stock, imagen_url });
    if (errores.length) {
      return res.status(400).json({ error: errores.join('. ') });
    }

    const [result] = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, categoria, imagen_url, stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre.trim(),
        descripcion?.trim() || null,
        Number(precio),
        categoria,
        imagen_url?.trim() || null,
        stock !== undefined && stock !== '' ? Number(stock) : 0,
      ]
    );

    return res.status(201).json({ message: 'Producto creado', id: result.insertId });
  } catch (err) {
    next(err);
  }
}

// PUT /api/productos/:id — solo Admin, actualiza solo los campos enviados
async function update(req, res, next) {
  try {
    const { id }  = req.params;
    const campos  = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    const keys = Object.keys(campos).filter(k => k !== 'id');
    if (keys.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
    }

    // Valida solo los campos presentes
    const errores = validarProducto({
      nombre:     campos.nombre,
      precio:     campos.precio,
      categoria:  campos.categoria,
      stock:      campos.stock,
      imagen_url: campos.imagen_url,
    });
    // Filtra solo errores de campos presentes en la petición
    const erroresFiltrados = errores.filter(e => {
      if (e.includes('nombre')     && campos.nombre     === undefined) return false;
      if (e.includes('precio')     && campos.precio     === undefined) return false;
      if (e.includes('categoria')  && campos.categoria  === undefined) return false;
      if (e.includes('stock')      && campos.stock      === undefined) return false;
      if (e.includes('imagen_url') && campos.imagen_url === undefined) return false;
      return true;
    });
    if (erroresFiltrados.length) {
      return res.status(400).json({ error: erroresFiltrados.join('. ') });
    }

    // Sanitiza strings
    if (campos.nombre)      campos.nombre      = campos.nombre.trim();
    if (campos.descripcion) campos.descripcion = campos.descripcion.trim();
    if (campos.imagen_url)  campos.imagen_url  = campos.imagen_url.trim();
    if (campos.precio)      campos.precio      = Number(campos.precio);
    if (campos.stock !== undefined) campos.stock = Number(campos.stock);

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const valores   = [...keys.map(k => campos[k]), id];

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

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    const [result] = await pool.query(
      'UPDATE productos SET activo = 0 WHERE id = ? AND activo = 1',
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
