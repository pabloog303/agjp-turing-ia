import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap } from '../gsap.config.js'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const navRef = useRef(null)

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -60,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, { scope: navRef })

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav ref={navRef} className="bg-navy h-16 sticky top-0 z-50 flex items-center justify-between px-6 shadow-lg">
      {/* Logo */}
      <span
        className="text-white font-bold text-lg cursor-pointer"
        onClick={() => navigate('/')}
      >
        🖥 Turing Catalog
      </span>

      {/* Acciones de sesión */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-gray-300 text-sm hidden sm:block">
              Hola, <span className="text-mint font-semibold">{user.nombre}</span>
            </span>
            <button onClick={handleLogout} className="btn-outline text-sm py-1 px-4">
              Cerrar sesión
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} className="btn-primary text-sm py-1 px-4">
            Login
          </button>
        )}
      </div>
    </nav>
  )
}
