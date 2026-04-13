import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../gsap.config.js'

export default function ConfirmModal({ open, titulo, mensaje, onConfirm, onCancel, loading = false }) {
  const backdropRef = useRef(null)
  const cardRef     = useRef(null)

  useGSAP(() => {
    if (!open) return
    gsap.from(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.out' })
    gsap.from(cardRef.current,     { y: 24, opacity: 0, scale: 0.96, duration: 0.25, ease: 'power2.out' })
  }, { dependencies: [open] })

  // Cierra con Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === backdropRef.current) onCancel() }}
    >
      <div ref={cardRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        {/* Icono advertencia */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-[#1a2332] text-center mb-1">{titulo}</h3>
        <p className="text-gray-500 text-sm text-center mb-6">{mensaje}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm
                       hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm
                       hover:bg-red-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
