import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../gsap.config.js'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate  = useNavigate()
  const navRef    = useRef(null)
  const progressRef = useRef(null)

  // Slide-down on mount
  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -60,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, { scope: navRef })

  // Scroll progress bar
  useEffect(() => {
    if (!progressRef.current) return

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      scrub: 0.3,
      onUpdate: (self) => {
        gsap.set(progressRef.current, { scaleX: self.progress, transformOrigin: 'left center' })
      },
    })

    return () => trigger.kill()
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav ref={navRef} className="bg-navy h-16 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between px-6 h-full">
        <Logo size="sm" onClick={() => navigate('/')} />

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
      </div>

      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="absolute bottom-0 left-0 h-0.5 w-full bg-[#00e5a0] origin-left scale-x-0"
      />
    </nav>
  )
}
