const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Construye los headers según si hay token o no
function getHeaders(token = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

// GET /api/productos — público
export async function getProductos() {
  const response = await fetch(`${API_URL}/productos`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Error al obtener productos')
  return data
}

// POST /api/auth/login
export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method:  'POST',
    headers: getHeaders(),
    body:    JSON.stringify({ email, password }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Error al iniciar sesión')
  return data
}

// POST /api/productos — requiere token Admin
export async function createProducto(productoData, token) {
  const response = await fetch(`${API_URL}/productos`, {
    method:  'POST',
    headers: getHeaders(token),
    body:    JSON.stringify(productoData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Error al crear producto')
  return data
}

// PUT /api/productos/:id — requiere token Admin
export async function updateProducto(id, productoData, token) {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method:  'PUT',
    headers: getHeaders(token),
    body:    JSON.stringify(productoData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Error al actualizar producto')
  return data
}

// DELETE /api/productos/:id — requiere token Admin
export async function deleteProducto(id, token) {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method:  'DELETE',
    headers: getHeaders(token),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Error al eliminar producto')
  return data
}
