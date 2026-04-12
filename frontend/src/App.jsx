import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import CatalogPage       from './pages/CatalogPage'
import LoginPage         from './pages/LoginPage'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"             element={<CatalogPage />} />
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          {/* Redirige cualquier ruta desconocida al catálogo */}
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
