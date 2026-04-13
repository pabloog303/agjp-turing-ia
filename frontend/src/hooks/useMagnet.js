import { useRef, useEffect } from 'react'
import { gsap } from '../gsap.config.js'

/**
 * Efecto magnético sutil: el elemento se desplaza ligeramente hacia el cursor
 * al hacer hover y vuelve a su posición original al salir.
 *
 * @param {number} strength  Intensidad del imán (0–1). Default 0.35
 */
export function useMagnet(strength = 0.35) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function onMove(e) {
      const rect   = el.getBoundingClientRect()
      const cx     = rect.left + rect.width  / 2
      const cy     = rect.top  + rect.height / 2
      const dx     = (e.clientX - cx) * strength
      const dy     = (e.clientY - cy) * strength

      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' })
    }

    function onLeave() {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return ref
}
