import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../gsap.config.js'
import Navbar  from '../components/Navbar'
import Spinner from '../components/Spinner'
import { getProductos } from '../services/api'
import { getGallery } from '../data/productImages.js'
import { useMagnet } from '../hooks/useMagnet.js'

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

const CATEGORIA_COLORS = {
  Hardware:  { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200' },
  Software:  { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  Servicios: { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-200' },
}

export default function ProductDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [producto,    setProducto]    = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [imgIndex,    setImgIndex]    = useState(0)
  const [cantidad,    setCantidad]    = useState(1)
  const [enCarrito,   setEnCarrito]   = useState(false)

  const heroRef      = useRef(null)
  const colIzqRef    = useRef(null)
  const colDerRef    = useRef(null)
  const specsRef     = useRef(null)
  const planesRef    = useRef(null)
  const imgRef       = useRef(null)
  const priceRef     = useRef(null)
  const magnetCart   = useMagnet(0.4)
  const magnetContact = useMagnet(0.4)

  useEffect(() => {
    async function cargar() {
      try {
        let data
        try { data = await getProductos() } catch { data = MOCK_PRODUCTOS }
        const encontrado = data.find(p => String(p.id) === String(id))
        if (!encontrado) { setError('Producto no encontrado'); return }
        setProducto(encontrado)
        setImgIndex(0)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [id])

  // Hero
  useGSAP(() => {
    if (!producto) return
    const tl = gsap.timeline()
    tl.fromTo('.hero-breadcrumb', { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' })
      .fromTo('.hero-nombre',     { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .fromTo('.hero-precio',     { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.35')
      .fromTo('.hero-volver',     { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.25')
  }, { scope: heroRef, dependencies: [producto] })

  // Columna izquierda
  useGSAP(() => {
    if (!producto) return
    gsap.fromTo(colIzqRef.current, { x: -25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.15 })
  }, { scope: colIzqRef, dependencies: [producto] })

  // Columna derecha
  useGSAP(() => {
    if (!producto) return
    gsap.fromTo(colDerRef.current, { x: 25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.25 })
  }, { scope: colDerRef, dependencies: [producto] })

  // Contador animado de precio
  useEffect(() => {
    if (!producto || !priceRef.current) return
    const target = Number(producto.precio)
    const counter = { val: 0 }
    gsap.to(counter, {
      val: target,
      duration: 1.2,
      delay: 0.4,
      ease: 'power2.out',
      onUpdate: () => {
        if (priceRef.current) {
          priceRef.current.textContent =
            '$' + counter.val.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }
      },
    })
  }, [producto])

  // Specs
  useEffect(() => {
    if (!producto || !specsRef.current) return
    const items = specsRef.current.querySelectorAll('.spec-item')
    gsap.from(items, {
      y: 15, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
      scrollTrigger: { trigger: specsRef.current, start: 'top 85%', once: true },
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [producto])

  // Planes
  useEffect(() => {
    if (!producto || !planesRef.current) return
    const cards = planesRef.current.querySelectorAll('.plan-card')
    gsap.from(cards, {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: planesRef.current, start: 'top 85%', once: true },
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [producto])

  // Animación de cambio de imagen
  function cambiarImagen(newIndex) {
    if (!imgRef.current) { setImgIndex(newIndex); return }
    gsap.to(imgRef.current, {
      opacity: 0, scale: 0.97, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        setImgIndex(newIndex)
        gsap.to(imgRef.current, { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' })
      },
    })
  }

  function prev() {
    if (!gallery.length) return
    cambiarImagen((imgIndex - 1 + gallery.length) % gallery.length)
  }

  function next() {
    if (!gallery.length) return
    cambiarImagen((imgIndex + 1) % gallery.length)
  }

  const gallery = producto ? getGallery(producto.id, producto.imagen_url) : []
  const catColor = CATEGORIA_COLORS[producto?.categoria] ?? { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }

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
        <p className="hero-breadcrumb text-gray-500 text-xs mb-2">
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

        {/* ── GALERÍA (col izquierda) ── */}
        <div ref={colIzqRef} className="lg:col-span-7 flex flex-col gap-4">

          {/* Imagen principal con botones de navegación */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg bg-[#1a2332] group">
            <img
              ref={imgRef}
              src={gallery[imgIndex]}
              alt={producto.nombre}
              className="w-full h-80 md:h-[420px] object-cover"
            />

            {/* Contador */}
            <span className="absolute top-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {imgIndex + 1} / {gallery.length}
            </span>

            {/* Botón anterior */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2
                         w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                         flex items-center justify-center text-white
                         opacity-0 group-hover:opacity-100 transition-all duration-200
                         hover:bg-[#00e5a0] hover:border-[#00e5a0] hover:text-[#1a2332]"
              aria-label="Imagen anterior"
            >
              ‹
            </button>

            {/* Botón siguiente */}
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                         flex items-center justify-center text-white
                         opacity-0 group-hover:opacity-100 transition-all duration-200
                         hover:bg-[#00e5a0] hover:border-[#00e5a0] hover:text-[#1a2332]"
              aria-label="Imagen siguiente"
            >
              ›
            </button>
          </div>

          {/* Tira de thumbnails */}
          <div className="flex gap-2">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => cambiarImagen(i)}
                className={`flex-1 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200
                  ${i === imgIndex
                    ? 'border-[#00e5a0] ring-2 ring-[#00e5a0]/50 scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-[#00e5a0]/40'
                  }`}
              >
                <img src={img} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Dots indicadores */}
          <div className="flex items-center justify-center gap-2">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => cambiarImagen(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === imgIndex
                    ? 'w-5 h-2 bg-[#00e5a0]'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── INFO PANEL (col derecha) ── */}
        <div ref={colDerRef} className="lg:col-span-5 flex flex-col gap-5">

          {/* Badge categoría + rating */}
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
              {producto.categoria}
            </span>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className={`w-4 h-4 fill-current ${s <= 4 ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
              <span className="text-xs text-gray-400 ml-1">(4.0)</span>
            </div>
          </div>

          {/* Nombre */}
          <h2 className="text-2xl font-bold text-[#1a2332] leading-tight">{producto.nombre}</h2>

          {/* Precio */}
          <div className="flex items-baseline gap-2">
            <span ref={priceRef} className="text-3xl font-extrabold text-[#00e5a0]">
              $0.00
            </span>
            <span className="text-sm text-gray-400">MXN · IVA incluido</span>
          </div>

          {/* Stock badge */}
          <div>
            {producto.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                En stock — {producto.stock} disponibles
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                Agotado
              </span>
            )}
          </div>

          {/* Descripción */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Descripción</p>
            <p className="text-gray-600 text-sm leading-relaxed">{producto.descripcion}</p>
          </div>

          {/* Especificaciones */}
          <div ref={specsRef} className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Especificaciones</p>
            <ul className="flex flex-col gap-2">
              {SPECS.map(s => (
                <li key={s.label} className="spec-item flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#00e5a0] inline-block" />
                    {s.label}
                  </span>
                  <span className="font-semibold text-[#1a2332]">{s.valor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Selector de cantidad */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">Cantidad</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setCantidad(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-[#1a2332] hover:bg-[#00e5a0]/10 transition-colors font-bold text-lg"
              >
                −
              </button>
              <span className="w-12 text-center font-bold text-[#1a2332] text-sm">{cantidad}</span>
              <button
                onClick={() => setCantidad(q => Math.min(producto.stock, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-[#1a2332] hover:bg-[#00e5a0]/10 transition-colors font-bold text-lg"
                disabled={cantidad >= producto.stock}
              >
                +
              </button>
            </div>
            <span className="text-xs text-gray-400">máx. {producto.stock}</span>
          </div>

          {/* Botones CTA */}
          <div className="flex flex-col gap-3 pt-1">
            <button
              ref={magnetCart}
              onClick={() => setEnCarrito(true)}
              disabled={producto.stock === 0}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200
                ${enCarrito
                  ? 'bg-green-500 text-white'
                  : 'bg-[#00e5a0] text-[#1a2332] hover:bg-[#00c989] active:scale-[0.98]'
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {enCarrito ? '✓ Agregado al carrito' : `🛒 Agregar al carrito · ${cantidad}`}
            </button>
            <button
              ref={magnetContact}
              className="w-full py-3 rounded-xl font-semibold text-sm border-2 border-[#1a2332] text-[#1a2332] hover:bg-[#1a2332] hover:text-white transition-all duration-200 active:scale-[0.98]"
            >
              📞 Contactar proveedor
            </button>
          </div>
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
        {Array.from({ length: 6 }, (_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all ${
              i + 1 === Number(id)
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
          <h2 className="text-2xl font-bold leading-snug">¿Necesitas asesoría personalizada?</h2>
          <p className="text-gray-400 text-sm">Nuestro equipo de expertos está listo para ayudarte.</p>
          <button className="btn-primary w-fit">Contactar ahora</button>
        </div>
        <div className="bg-[#00e5a0] min-h-52 md:min-h-0" />
      </section>

      {/* ── TABLA COMPARATIVA ── */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-2">Planes</p>
        <h2 className="text-2xl font-bold text-[#1a2332] text-center mb-10">Elige tu plan</h2>
        <div ref={planesRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00e5a0] text-[#1a2332] text-xs font-bold px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
              <h3 className="font-bold text-center text-base text-[#1a2332]">{plan.nombre}</h3>
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
              <li><Link to="/"      className="hover:text-[#00e5a0] transition-colors">Catálogo</Link></li>
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
