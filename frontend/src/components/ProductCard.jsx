import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '../gsap.config.js'
import { getMainImage } from '../data/productImages.js'

export default function ProductCard({ producto, isAdmin, onEdit, onDelete }) {
  const navigate = useNavigate()
  const { id, nombre, descripcion, precio, imagen_url, categoria } = producto
  const imagen   = getMainImage(id, imagen_url)
  const cardRef  = useRef(null)

  // ── 3D tilt on hover ────────────────────────────────────────────────────
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    function onMove(e) {
      const rect   = el.getBoundingClientRect()
      const cx     = rect.left + rect.width  / 2
      const cy     = rect.top  + rect.height / 2
      const dx     = (e.clientX - cx) / (rect.width  / 2)   // −1 … 1
      const dy     = (e.clientY - cy) / (rect.height / 2)   // −1 … 1
      const rotX   = -dy * 8    // inclinación vertical máx ±8°
      const rotY   =  dx * 8    // inclinación horizontal máx ±8°

      gsap.to(el, {
        rotateX: rotX,
        rotateY: rotY,
        scale: 1.03,
        transformPerspective: 800,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    function onLeave() {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)',
      })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="card flex flex-col"
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* Imagen */}
      {imagen ? (
        <img src={imagen} alt={nombre} className="h-44 w-full object-cover bg-[#1a2332]" />
      ) : (
        <div className="h-44 w-full bg-[#1a2332] flex items-center justify-center text-gray-500 text-xs">
          Sin imagen
        </div>
      )}

      {/* Cuerpo */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{categoria}</p>
        <h3 className="font-bold text-[#1a2332] text-base mt-1 line-clamp-1">{nombre}</h3>
        <p className="text-[#00e5a0] font-bold text-lg mt-1">
          ${Number(precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-gray-500 text-xs mt-2 line-clamp-2 flex-1">{descripcion}</p>

        {/* Fila inferior */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map(s => (
              <svg key={s} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <button
            onClick={() => navigate(`/producto/${id}`)}
            className="text-[#00e5a0] font-bold text-lg hover:scale-125 transition-transform"
          >
            →
          </button>
        </div>

        {/* Acciones admin */}
        {isAdmin && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => onEdit(producto)}
              className="flex-1 text-xs bg-[#1a2332] text-white py-1.5 rounded-lg hover:opacity-80 transition-opacity"
            >
              ✏ Editar
            </button>
            <button
              onClick={() => onDelete(id, nombre)}
              className="flex-1 text-xs bg-red-50 text-red-600 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
            >
              🗑 Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
