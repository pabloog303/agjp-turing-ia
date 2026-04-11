// Rutas de productos con middlewares de autenticación y autorización
const express = require('express');
const { getAll, create, update, softDelete } = require('../controllers/productosController');
const checkAuth  = require('../middlewares/checkAuth');
const checkAdmin = require('../middlewares/checkAdmin');

const router = express.Router();

// Pública — cualquier visitante puede ver el catálogo
router.get('/',     getAll);

// Protegidas — requieren token válido + rol Admin
router.post('/',    [checkAuth, checkAdmin], create);
router.put('/:id',  [checkAuth, checkAdmin], update);
router.delete('/:id', [checkAuth, checkAdmin], softDelete);

module.exports = router;
