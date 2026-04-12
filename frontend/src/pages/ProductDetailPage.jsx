import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../gsap.config.js'
import Navbar  from '../components/Navbar'
import Spinner from '../components/Spinner'
import { getProductos } from '../services/api'

const SPECS = [
  { label: 'Garantía',       valor: '12 meses' },
  { label: 'Disponibilidad', valor: 'Inmediata' },
  { label: 'Envío',          valor: '3-5 días hábiles' },
  { label: 'Soporte',        valor: 'Incluido' },
]

const PLANES = [
  {
    nombre: 'Básico',
    destacado: false,
    items: ['1 usuario', 'Soporte email', '5 GB', 'API Access', 'Reportes'],
    checks: [true, true, true, false, false],
  },
  {
    nombre: 'Pro',
    destacado: true,
    items: ['5 usuarios', 'Soporte prioritario', '50 GB', 'API Access', 'Reportes avanzados'],
    checks: [true, true, true, true, true],
  },
  {
    nombre: 'Enterprise',
    destacado: false,
    items: ['Ilimitado', 'Soporte 24/7', '500 GB', 'API Access', 'Reportes avanzados'],
    checks: [true, true, true, true, true],
  },
]

const MOCK_PRODUCTOS = [
  { id:1, nombre:'NVIDIA RTX 4090 24GB',     descripcion:'GPU de alto rendimiento para gaming 4K, diseño 3D y cargas de trabajo de IA. Arquitectura Ada Lovelace con 16,384 núcleos CUDA.', precio:1299.99, categoria:'Hardware', imagen_url:'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=600&q=80', stock:5   },
  { id:2, nombre:'Intel Core i9-14900K',      descripcion:'Procesador flagship de 14ª generación con 24 núcleos, 6.0 GHz boost. Ideal para workstations, streaming y renderizado profesional.',  precio:589.99,  categoria:'Hardware', imagen_url:'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80', stock:8   },
  { id:3, nombre:'Adobe Creative Cloud',      descripcion:'Suite completa de aplicaciones creativas: Photoshop, Illustrator, Premiere Pro, After Effects y más de 20 apps. 100 GB en nube.',       precio:54.99,   categoria:'Software', imagen_url:'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80', stock:999 },
  { id:4, nombre:'AutoCAD 2025',              descripcion:'Software profesional de diseño CAD 2D/3D para ingeniería civil, arquitectura y manufactura. Incluye herramientas de colaboración.',      precio:220.00,  categoria:'Software', imagen_url:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80', stock:50  },
  { id:5, nombre:'Soporte Técnico 24/7',      descripcion:'Plan anual de soporte remoto especializado con tiempo de respuesta garantizado menor a 2 horas. Monitoreo proactivo y respaldo mensual.', precio:299.00,  categoria:'Servicios',imagen_url:'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80', stock:20  },
  { id:6, nombre:'Setup e Instalación Pro',   descripcion:'Instalación y configuración profesional de hardware y software a domicilio o remoto. Incluye optimización del sistema y pruebas.',        precio:89.99,   categoria:'Servicios',imagen_url:'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80', stock:15  },
]

export default function ProductDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [producto,     setProducto]     = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [imagenActiva, setImagenActiva] = useState('')

  const heroRef   = useRef(null)
  const colIzqRef = useRef(null)
  const colDerRef = useRef(null)
  const specsRef  = useRef(null)
  const planesRef = useRef(null)

  useEffect(() => {
    async function cargar() {
      try {
        let data
        try {
          data = await getProductos()
        } catch {
          data = MOCK_PRODUCTOS
        }
        const encontrado = data.find(p => String(p.id) === String(id))
        if (!encontrado) { setError('Producto no encontrado'); return }
        setProducto(encontrado)
        setImagenActiva(encontrado.imagen_url || '')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [id])

  // Hero slide-in desde izquierda
  useGSAP(() => {
    if (!producto) return
    gsap.from('.hero-nombre', { x: -30, opacity: 0, duration: 0.6, ease: 'power2.out' })
    gsap.from('.hero-precio', { x: -30, opacity: 0, duration: 0.6, delay: 0.15, ease: 'power2.out' })
    gsap.from('.hero-volver', { x: -20, opacity: 0, duration: 0.5, delay: 0.25, ease: 'power2.out' })
  }, { scope: heroRef, dependencies: [producto] })

  // Columna izquierda fade desde izquierda
  useGSAP(() => {
    if (!producto) return
    gsap.from(colIzqRef.current, { x: -20, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.1 })
  }, { scope: colIzqRef, dependencies: [producto] })

  // Columna derecha fade desde derecha
  useGSAP(() => {
    if (!producto) return
    gsap.from(colDerRef.current, { x: 20, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.2 })
  }, { scope: colDerRef, dependencies: [producto] })

  // Specs con ScrollTrigger stagger
  useEffect(() => {
    if (!producto || !specsRef.current) return
    const items = specsRef.current.querySelectorAll('.spec-item')
    gsap.from(items, {
      y: 15,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: specsRef.current,
        start: 'top 85%',
        once: true,
      },
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [producto])

  // Planes con ScrollTrigger stagger
  useEffect(() => {
    if (!producto || !planesRef.current) return
    const cards = planesRef.current.querySelectorAll('.plan-card')
    gsap.from(cards, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: planesRef.current,
        start: 'top 85%',
        once: true,
      },
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [producto])

  const thumbnails = producto ? [
    producto.imagen_url,
    producto.imagen_url?.replace('1a2332', '2a3342'),
    producto.imagen_url?.replace('1a2332', '0d1a2a'),
  ] : []

  const miniThumbs = producto ? [
    producto.imagen_url?.replace('400x225', '200x150'),
    producto.imagen_url?.replace('400x225', '200x150').replace('1a2332', '2a3342'),
    producto.imagen_url?.replace('400x225', '200x150').replace('1a2332', '0d1a2a'),
    producto.imagen_url?.replace('400x225', '200x150').replace('1a2332', '162233'),
  ] : []

  if (loading) return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" text="Cargando producto..." />
      </div>
    </div>
  )

  if (error || !producto) return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || 'Producto no encontrado'}</p>
        <Link to="/" className="btn-primary">← Volver al catálogo</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Navbar />

      {/* ── HERO ── */}
      <section ref={heroRef} className="bg-[#1a2332] text-white py-10 px-8">
        <p className="text-gray-500 text-xs mb-2">
          Catálogo › {producto.categoria} › {producto.nombre}
        </p>
        <h1 className="hero-nombre text-3xl font-bold">{producto.nombre}</h1>
        <p className="hero-precio text-[#00e5a0] text-2xl font-bold mt-1">
          ${Number(producto.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </p>
        <Link to="/" className="hero-volver btn-outline inline-block mt-4 text-sm py-1.5 px-5">
          ← Volver
        </Link>
      </section>

      {/* ── SECCIÓN PRINCIPAL ── */}
      <section className="max-w-6xl mx-auto py-10 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* COL IZQUIERDA */}
        <div ref={colIzqRef} className="lg:col-span-7 flex flex-col gap-4">
          <div className="rounded-xl overflow-hidden shadow-md bg-[#1a2332]">
            <img
              src={imagenActiva}
              alt={producto.nombre}
              className="w-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            {thumbnails.map((thumb, i) => (
              <img
                key={i}
                src={thumb}
                alt={`Vista ${i + 1}`}
                onClick={() => setImagenActiva(thumb)}
                className={`flex-1 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all
                  ${imagenActiva === thumb
                    ? 'border-[#00e5a0] ring-2 ring-[#00e5a0]'
                    : 'border-transparent hover:border-[#00e5a0]/50'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* COL DERECHA */}
        <div ref={colDerRef} className="lg:col-span-5 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-2">
            {miniThumbs.map((src, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden bg-[#1a2332] aspect-video cursor-pointer
                           hover:ring-2 hover:ring-[#00e5a0] transition-all"
                onClick={() => setImagenActiva(src)}
              >
                <img src={src} alt={`Mini ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {producto.stock > 0 ? (
            <span className="text-green-500 font-semibold text-sm">
              ✓ En stock ({producto.stock} disponibles)
            </span>
          ) : (
            <span className="text-red-500 font-semibold text-sm">✗ Agotado</span>
          )}

          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Descripción</p>
            <p className="text-gray-600 text-sm leading-relaxed">{producto.descripcion}</p>
          </div>

          {/* Especificaciones */}
          <div ref={specsRef}>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Especificaciones</p>
            <ul className="flex flex-col gap-2">
              {SPECS.map(s => (
                <li key={s.label} className="spec-item flex justify-between text-sm border-b border-gray-100 pb-1">
                  <span className="text-gray-500">{s.label}</span>
                  <span className="font-semibold text-[#1a2332]">{s.valor}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="btn-primary w-full">🛒 Agregar al carrito</button>
          <button className="btn-outline w-full">📞 Contactar proveedor</button>
        </div>
      </section>

      {/* ── PAGINACIÓN ── */}
      <div className="flex items-center justify-center gap-3 py-8">
        <button
          onClick={() => navigate(`/producto/${Math.max(1, Number(id) - 1)}`)}
          className="text-[#1a2332] font-bold px-2 hover:text-[#00e5a0] transition-colors text-lg"
        >
          ◄
        </button>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all ${
              i === Number(id) % 5
                ? 'w-4 h-4 bg-[#00e5a0]'
                : 'w-3 h-3 bg-gray-300'
            }`}
          />
        ))}
        <button
          onClick={() => navigate(`/producto/${Number(id) + 1}`)}
          className="text-[#1a2332] font-bold px-2 hover:text-[#00e5a0] transition-colors text-lg"
        >
          ►
        </button>
      </div>

      {/* ── BANNER CTA ── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-[#1a2332] text-white p-14 flex flex-col justify-center gap-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest">¿Necesitas ayuda?</p>
          <h2 className="text-2xl font-bold leading-snug">
            ¿Necesitas asesoría personalizada?
          </h2>
          <p className="text-gray-400 text-sm">
            Nuestro equipo de expertos está listo para ayudarte.
          </p>
          <button className="btn-primary w-fit">Contactar ahora</button>
        </div>
        <div className="bg-[#00e5a0] min-h-52 md:min-h-0" />
      </section>

      {/* ── TABLA COMPARATIVA ── */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-2">Planes</p>
        <h2 className="text-2xl font-bold text-[#1a2332] text-center mb-10">Elige tu plan</h2>

        <div ref={planesRef} className="grid grid-cols-3 gap-4">
          {PLANES.map(plan => (
            <div
              key={plan.nombre}
              className={`plan-card rounded-2xl p-6 flex flex-col gap-3 ${
                plan.destacado
                  ? 'bg-[#00e5a0]/10 ring-2 ring-[#00e5a0] shadow-xl relative'
                  : 'bg-white shadow-md'
              }`}
            >
              {plan.destacado && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00e5a0] text-[#1a2332]
                                 text-xs font-bold px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
              <h3 className="font-bold text-center text-base text-[#1a2332]">
                {plan.nombre}
              </h3>
              <ul className="flex flex-col gap-2 flex-1">
                {plan.items.map((item, i) => (
                  <li key={item} className="text-xs text-gray-600 flex items-center gap-2">
                    <span className={plan.checks[i] ? 'text-[#00e5a0]' : 'text-gray-300'}>
                      {plan.checks[i] ? '✓' : '✗'}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button className={`mt-3 w-full text-sm py-2 rounded-full font-semibold transition-colors ${
                plan.destacado
                  ? 'bg-[#00e5a0] text-[#1a2332] hover:bg-[#00c989]'
                  : 'border-2 border-[#00e5a0] text-[#00e5a0] hover:bg-[#00e5a0] hover:text-[#1a2332]'
              }`}>
                Elegir plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a2332] text-white">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-400">
          <div>
            <div className="grid grid-cols-2 gap-2 w-16 mb-4">
              <div className="w-7 h-7 bg-[#00e5a0] rounded-sm" />
              <div className="w-7 h-7 bg-[#00e5a0] opacity-50 rounded-sm" />
              <div className="w-7 h-7 bg-white/20 rounded-sm" />
              <div className="w-7 h-7 bg-[#00e5a0] opacity-25 rounded-sm" />
            </div>
            <p className="text-xs">Tu tienda de tecnología de confianza.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Enlaces</p>
            <ul className="flex flex-col gap-2 text-xs">
              <li><Link to="/" className="hover:text-[#00e5a0] transition-colors">Catálogo</Link></li>
              <li><Link to="/login" className="hover:text-[#00e5a0] transition-colors">Iniciar sesión</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Contacto</p>
            <p className="text-xs">contacto@turing-ia.com</p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-gray-500 text-xs">
          © 2025 Turing-IA Tech Catalog. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
