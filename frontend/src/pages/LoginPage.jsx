import { useState, useRef } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap } from '../gsap.config.js'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const cardRef = useRef(null)

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
    })
  }, { scope: cardRef })

  // Campos del formulario
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  // Estados de UI
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Si ya está autenticado, redirige al catálogo
  if (isAuthenticated) return <Navigate to="/" replace />

  // Validaciones en tiempo real
  const emailError    = email.trim() === '' || !email.includes('@') || !email.includes('.')
    ? 'Email inválido' : ''
  const passwordError = password.length > 0 && password.length < 6
    ? 'Mínimo 6 caracteres' : ''

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)

    // Detiene si hay errores de validación
    if (emailError || passwordError || password.length === 0) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (response.ok) {
        login(data.token, data.user)
        navigate('/')
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-light min-h-screen flex items-center justify-center px-4">
      <div ref={cardRef} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy">🖥 Turing Catalog</h1>
          <p className="text-gray-500 mt-2 text-sm">Inicia sesión para continuar</p>
        </div>

        {/* Mensaje de error del servidor */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Campo Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-navy mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@turing.com"
              className="border border-gray-200 rounded-lg px-4 py-3 w-full
                         focus:ring-2 focus:ring-mint focus:outline-none text-sm"
            />
            {submitted && emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          {/* Campo Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-navy mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-gray-200 rounded-lg px-4 py-3 w-full
                         focus:ring-2 focus:ring-mint focus:outline-none text-sm"
            />
            {submitted && passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>

        {/* Link al catálogo sin login */}
        <div className="text-center mt-4">
          <Link to="/" className="text-mint hover:underline text-sm">
            Ver catálogo sin login →
          </Link>
        </div>
      </div>
    </div>
  )
}
