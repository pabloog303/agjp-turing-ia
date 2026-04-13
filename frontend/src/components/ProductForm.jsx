import { useState, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../gsap.config.js'
import { useAuth } from '../context/AuthContext'
import { createProducto, updateProducto } from '../services/api'

const CATEGORIAS = ['Hardware', 'Software', 'Servicios']

const EMPTY_FORM = {
  nombre:      '',
  descripcion: '',
  precio:      '',
  categoria:   'Hardware',
  imagen_url:  '',
  stock:       '',
}

export default function ProductForm({ open, producto, onClose, onSaved }) {
  const { token } = useAuth()

  const [form,    setForm]    = useState(EMPTY_FORM)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [apiErr,  setApiErr]  = useState('')

  const backdropRef = useRef(null)
  const cardRef     = useRef(null)

  const isEdit = Boolean(producto)

  // Rellena el form cuando se abre en modo edición
  useEffect(() => {
    if (open) {
      setForm(producto
        ? {
            nombre:      producto.nombre      ?? '',
            descripcion: producto.descripcion ?? '',
            precio:      producto.precio      ?? '',
            categoria:   producto.categoria   ?? 'Hardware',
            imagen_url:  producto.imagen_url  ?? '',
            stock:       producto.stock       ?? '',
          }
        : EMPTY_FORM
      )
      setErrors({})
      setApiErr('')
    }
  }, [open, producto])

  // Animación de apertura
  useGSAP(() => {
    if (!open) return
    gsap.from(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.out' })
    gsap.from(cardRef.current,     { y: 30, opacity: 0, scale: 0.97, duration: 0.28, ease: 'power2.out' })
  }, { dependencies: [open] })

  // Cierra con Escape
  useEffect(() => {
    if (!open) return
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setApiErr('')
  }

  function validate() {
    const errs = {}
    if (!form.nombre.trim())               errs.nombre   = 'El nombre es requerido'
    if (!form.precio || isNaN(form.precio) || Number(form.precio) <= 0)
                                           errs.precio   = 'Precio debe ser un número mayor a 0'
    if (!form.categoria)                   errs.categoria = 'Selecciona una categoría'
    if (form.stock !== '' && (isNaN(form.stock) || Number(form.stock) < 0))
                                           errs.stock    = 'Stock debe ser un número ≥ 0'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiErr('')
    try {
      const payload = {
        nombre:      form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        precio:      Number(form.precio),
        categoria:   form.categoria,
        imagen_url:  form.imagen_url.trim() || null,
        stock:       form.stock !== '' ? Number(form.stock) : 0,
      }

      if (isEdit) {
        await updateProducto(producto.id, payload, token)
      } else {
        await createProducto(payload, token)
      }

      onSaved()
      onClose()
    } catch (err) {
      setApiErr(err.message || 'Error al guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8 overflow-y-auto"
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
    >
      <div ref={cardRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#1a2332]">
            {isEdit ? '✏️ Editar producto' : '➕ Nuevo producto'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
                       hover:bg-gray-100 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 flex flex-col gap-4">

          {apiErr && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {apiErr}
            </div>
          )}

          {/* Nombre */}
          <Field label="Nombre *" error={errors.nombre}>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: NVIDIA RTX 4090"
              className={inputCls(errors.nombre)}
            />
          </Field>

          {/* Descripción */}
          <Field label="Descripción" error={errors.descripcion}>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción del producto..."
              className={inputCls(errors.descripcion) + ' resize-none'}
            />
          </Field>

          {/* Precio + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Precio (MXN) *" error={errors.precio}>
              <input
                name="precio"
                type="number"
                min="0.01"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
                placeholder="0.00"
                className={inputCls(errors.precio)}
              />
            </Field>
            <Field label="Stock" error={errors.stock}>
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                className={inputCls(errors.stock)}
              />
            </Field>
          </div>

          {/* Categoría */}
          <Field label="Categoría *" error={errors.categoria}>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className={inputCls(errors.categoria)}
            >
              {CATEGORIAS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          {/* Imagen URL */}
          <Field label="URL de imagen" error={errors.imagen_url}>
            <input
              name="imagen_url"
              value={form.imagen_url}
              onChange={handleChange}
              placeholder="https://..."
              className={inputCls(errors.imagen_url)}
            />
          </Field>

          {/* Preview imagen */}
          {form.imagen_url && (
            <div className="rounded-xl overflow-hidden h-36 bg-[#1a2332]">
              <img
                src={form.imagen_url}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          )}

          {/* Footer botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm
                         hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#00e5a0] text-[#1a2332] font-bold text-sm
                         hover:bg-[#00c989] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}

function inputCls(error) {
  return `w-full px-3 py-2.5 rounded-xl border text-sm transition-all outline-none
    ${error
      ? 'border-red-300 focus:ring-2 focus:ring-red-200'
      : 'border-gray-200 focus:ring-2 focus:ring-[#00e5a0]/50 focus:border-[#00e5a0]'
    }`
}
