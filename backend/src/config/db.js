// Configuración del pool de conexiones MySQL con mysql2/promise
const mysql = require('mysql2/promise');

// Pool reutiliza conexiones en lugar de abrir una nueva por request
const pool = mysql.createPool({
  host:             process.env.DB_HOST,
  user:             process.env.DB_USER,
  password:         process.env.DB_PASS,
  database:         process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0
});

// Verifica que la conexión a la DB funciona al arrancar el servidor
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    conn.release();
    console.log('✅ Conexión a MySQL establecida correctamente');
  } catch (err) {
    console.error('❌ Error al conectar con MySQL:', err.message);
  }
}

testConnection();

module.exports = pool;
