import { useState, useEffect, useRef } from 'react'
import Navbar        from '../components/Navbar'
import ProductCard   from '../components/ProductCard'
import Spinner       from '../components/Spinner'
import ProductForm   from '../components/ProductForm'
import ConfirmModal  from '../components/ConfirmModal'
import { getProductos, deleteProducto } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useGSAP } from '@gsap/react'
import { gsap } from '../gsap.config.js'

const CATEGORIAS = ['Hardware', 'Software', 'Servicios']

const CAT_ICONS = {
  Hardware: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <rect x="8" y="8" width="8"  height="8"  rx="1"/>
      <line x1="9"  y1="4" x2="9"  y2="2"/><line x1="12" y1="4" x2="12" y2="2"/><line x1="15" y1="4" x2="15" y2="2"/>
      <line x1="9"  y1="22" x2="9"  y2="20"/><line x1="12" y1="22" x2="12" y2="20"/><line x1="15" y1="22" x2="15" y2="20"/>
      <line x1="4"  y1="9" x2="2"  y2="9"/><line x1="4" y1="12" x2="2" y2="12"/><line x1="4" y1="15" x2="2" y2="15"/>
      <line x1="22" y1="9" x2="20" y2="9"/><line x1="22" y1="12" x2="20" y2="12"/><line x1="22" y1="15" x2="20" y2="15"/>
    </svg>
  ),
  Software: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
      <line x1="12" y1="2" x2="12" y2="22" opacity="0.4"/>
    </svg>
  ),
  Servicios: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="9" y1="10" x2="15" y2="10"/>
      <line x1="12" y1="7"  x2="12" y2="13"/>
    </svg>
  ),
}

const CAT_ICONS_LG = {
  Hardware: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <rect x="8" y="8" width="8"  height="8"  rx="1"/>
      <line x1="9"  y1="4" x2="9"  y2="2"/><line x1="12" y1="4" x2="12" y2="2"/><line x1="15" y1="4" x2="15" y2="2"/>
      <line x1="9"  y1="22" x2="9"  y2="20"/><line x1="12" y1="22" x2="12" y2="20"/><line x1="15" y1="22" x2="15" y2="20"/>
      <line x1="4"  y1="9" x2="2"  y2="9"/><line x1="4" y1="12" x2="2" y2="12"/><line x1="4" y1="15" x2="2" y2="15"/>
      <line x1="22" y1="9" x2="20" y2="9"/><line x1="22" y1="12" x2="20" y2="12"/><line x1="22" y1="15" x2="20" y2="15"/>
    </svg>
  ),
  Software: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
      <line x1="12" y1="2" x2="12" y2="22" opacity="0.4"/>
    </svg>
  ),
  Servicios: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="9" y1="10" x2="15" y2="10"/>
      <line x1="12" y1="7"  x2="12" y2="13"/>
    </svg>
  ),
}

const MOCK_PRODUCTOS = [
  { id:1, nombre:'NVIDIA RTX 4090 24GB',     descripcion:'GPU de alto rendimiento para gaming 4K, diseño 3D y cargas de trabajo de IA. Arquitectura Ada Lovelace con 16,384 núcleos CUDA.', precio:1299.99, categoria:'Hardware', imagen_url:'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=600&q=80', stock:5   },
  { id:2, nombre:'Intel Core i9-14900K',      descripcion:'Procesador flagship de 14ª generación con 24 núcleos, 6.0 GHz boost. Ideal para workstations, streaming y renderizado profesional.',  precio:589.99,  categoria:'Hardware', imagen_url:'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80', stock:8   },
  { id:3, nombre:'Adobe Creative Cloud',      descripcion:'Suite completa de aplicaciones creativas: Photoshop, Illustrator, Premiere Pro, After Effects y más de 20 apps. 100 GB en nube.',       precio:54.99,   categoria:'Software', imagen_url:'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80', stock:999 },
  { id:4, nombre:'AutoCAD 2025',              descripcion:'Software profesional de diseño CAD 2D/3D para ingeniería civil, arquitectura y manufactura. Incluye herramientas de colaboración.',      precio:220.00,  categoria:'Software', imagen_url:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80', stock:50  },
  { id:5, nombre:'Soporte Técnico 24/7',      descripcion:'Plan anual de soporte remoto especializado con tiempo de respuesta garantizado menor a 2 horas. Monitoreo proactivo y respaldo mensual.', precio:299.00,  categoria:'Servicios',imagen_url:'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80', stock:20  },
  { id:6, nombre:'Setup e Instalación Pro',   descripcion:'Instalación y configuración profesional de hardware y software a domicilio o remoto. Incluye optimización del sistema y pruebas.',        precio:89.99,   categoria:'Servicios',imagen_url:'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80', stock:15  },
]

export default function CatalogPage() {
  const { isAdmin, token } = useAuth()

  const [productos,       setProductos]       = useState([])
  const [loading,         setLoading]         = useState(true)
  const [apiError,        setApiError]        = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [textoBusqueda,   setTextoBusqueda]   = useState('')
  const [itemsVisibles,   setItemsVisibles]   = useState(6)

  // Estado panel admin
  const [formOpen,       setFormOpen]       = useState(false)
  const [productoEdit,   setProductoEdit]   = useState(null)   // null = crear, obj = editar
  const [confirmOpen,    setConfirmOpen]    = useState(false)
  const [productoDelete, setProductoDelete] = useState(null)   // { id, nombre }
  const [deleteLoading,  setDeleteLoading]  = useState(false)
  const [toast,          setToast]          = useState('')

  const heroRef    = useRef(null)
  const filtrosRef = useRef(null)

  // ── Animación hero con text reveal letra a letra ─────────────────────────
  useGSAP(() => {
    const HERO_TEXT = 'Descubre los mejores gadgets tech'
    const titulo = heroRef.current?.querySelector('.hero-titulo')
    if (!titulo) return
    titulo.textContent = ''

    const tl = gsap.timeline()
    tl.to('.hero-titulo', {
        duration: 1.4,
        text: { value: HERO_TEXT, delimiter: '' },
        ease: 'none',
      })
      .fromTo('.hero-subtitulo', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .fromTo('.hero-btn',       { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.35')
  }, { scope: heroRef })

  // ── Animación filtros ────────────────────────────────────────────────────
  useGSAP(() => {
    gsap.fromTo('.filtro-btn',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
    )
  }, { scope: filtrosRef })

  // ── Carga de productos ───────────────────────────────────────────────────
  async function cargar() {
    try {
      setLoading(true)
      setApiError('')
      const data = await getProductos()
      setProductos(data)
    } catch {
      setProductos(MOCK_PRODUCTOS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  // ── Animación cards ───────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return
    const cards = document.querySelectorAll('.product-card-anim')
    if (!cards.length) return
    gsap.fromTo(
      cards,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out', delay: 0.05 }
    )
  }, [loading, productos, categoriaActiva, textoBusqueda])

  // ── Toast helper ─────────────────────────────────────────────────────────
  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // ── Handlers admin ───────────────────────────────────────────────────────
  function handleAgregar() {
    setProductoEdit(null)
    setFormOpen(true)
  }

  function handleEditar(producto) {
    setProductoEdit(producto)
    setFormOpen(true)
  }

  function handleEliminar(id, nombre) {
    setProductoDelete({ id, nombre })
    setConfirmOpen(true)
  }

  async function confirmarEliminar() {
    if (!productoDelete) return
    setDeleteLoading(true)
    try {
      await deleteProducto(productoDelete.id, token)
      showToast(`"${productoDelete.nombre}" eliminado correctamente`)
      setConfirmOpen(false)
      setProductoDelete(null)
      await cargar()
    } catch (err) {
      showToast(`Error: ${err.message}`)
    } finally {
      setDeleteLoading(false)
    }
  }

  async function handleGuardado() {
    showToast(productoEdit ? 'Producto actualizado' : 'Producto creado correctamente')
    await cargar()
  }

  // ── Filtrado ─────────────────────────────────────────────────────────────
  function toggleCategoria(cat) {
    if (categoriaActiva === cat) {
      setCategoriaActiva('Todos')
    } else {
      setCategoriaActiva(cat)
      if (categoriaActiva === 'Todos') {
        // scroll to the section anchor
        setTimeout(() => {
          document.getElementById(`sec-${cat}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
      }
    }
    setItemsVisibles(6)
  }

  function productosDeCat(cat) {
    return productos.filter(p =>
      p.categoria === cat &&
      p.nombre.toLowerCase().includes(textoBusqueda.toLowerCase())
    )
  }

  const productosFiltrados = productos.filter(p => {
    const porCategoria = categoriaActiva === 'Todos' || p.categoria === categoriaActiva
    const porBusqueda  = p.nombre.toLowerCase().includes(textoBusqueda.toLowerCase())
    return porCategoria && porBusqueda
  })

  const productosVisibles = productosFiltrados.slice(0, itemsVisibles)
  const hayMas            = itemsVisibles < productosFiltrados.length

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Navbar />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative bg-[#1a2332] text-white overflow-hidden flex flex-col justify-center"
        style={{ minHeight: '88vh' }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(#00e5a0 1px, transparent 1px), linear-gradient(90deg, #00e5a0 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />

        {/* Glow blobs */}
        <div className="absolute -top-20 left-1/3 w-[500px] h-[500px] bg-[#00e5a0] opacity-[0.08] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#00e5a0] opacity-[0.06] rounded-full blur-[90px] pointer-events-none" />

        {/* Decorative chip — right side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.12] hidden xl:block pointer-events-none select-none">
          <svg width="340" height="340" viewBox="0 0 340 340" fill="none">
            <rect x="80"  y="80"  width="180" height="180" rx="18" stroke="#00e5a0" strokeWidth="3"/>
            <rect x="110" y="110" width="120" height="120" rx="10" stroke="#00e5a0" strokeWidth="1.5"/>
            {/* Pins top */}
            {[120,145,170,195,220].map(x => <line key={`t${x}`} x1={x} y1="80" x2={x} y2="55" stroke="#00e5a0" strokeWidth="2.5" strokeLinecap="round"/>)}
            {/* Pins bottom */}
            {[120,145,170,195,220].map(x => <line key={`b${x}`} x1={x} y1="260" x2={x} y2="285" stroke="#00e5a0" strokeWidth="2.5" strokeLinecap="round"/>)}
            {/* Pins left */}
            {[120,145,170,195,220].map(y => <line key={`l${y}`} x1="80" y1={y} x2="55" y2={y} stroke="#00e5a0" strokeWidth="2.5" strokeLinecap="round"/>)}
            {/* Pins right */}
            {[120,145,170,195,220].map(y => <line key={`r${y}`} x1="260" y1={y} x2="285" y2={y} stroke="#00e5a0" strokeWidth="2.5" strokeLinecap="round"/>)}
            {/* Inner dot grid */}
            {[130,150,170,190,210].flatMap(x =>
              [130,150,170,190,210].map(y =>
                <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#00e5a0"/>
              )
            )}
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 py-24 max-w-4xl mx-auto w-full">

          {/* Live badge */}
          <div className="hero-subtitulo inline-flex items-center gap-2 bg-[#00e5a0]/10 border border-[#00e5a0]/25 text-[#00e5a0] text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-wide">
            <span className="w-1.5 h-1.5 bg-[#00e5a0] rounded-full animate-pulse" />
            Catálogo Tech 2025 — Siempre actualizado
          </div>

          {/* Headline */}
          <h1 className="hero-titulo text-5xl md:text-6xl font-black leading-[1.1] max-w-2xl">
            Descubre los mejores gadgets tech
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitulo text-gray-400 mt-6 text-lg max-w-lg leading-relaxed">
            Hardware, Software y Servicios de última generación para profesionales y entusiastas.
          </p>

          {/* CTAs */}
          <div className="hero-btn flex flex-wrap items-center justify-center gap-4 mt-10">
            <button
              className="btn-primary px-8 py-3 text-base"
              onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explorar catálogo →
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 text-base font-semibold rounded-full border border-white/20 text-white hover:border-[#00e5a0] hover:text-[#00e5a0] transition-colors"
            >
              Iniciar sesión
            </button>
          </div>

          {/* Category pills */}
          <div className="hero-subtitulo flex flex-wrap items-center justify-center gap-3 mt-12">
            {CATEGORIAS.map(cat => (
              <button
                key={cat}
                onClick={() => { toggleCategoria(cat); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-[#00e5a0]/10 border border-white/10 hover:border-[#00e5a0]/40 text-gray-300 hover:text-[#00e5a0] text-sm px-5 py-2 rounded-full transition-all"
              >
                {CAT_ICONS[cat]}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom fade into page background */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f0f4f8] to-transparent pointer-events-none" />
      </section>

      {/* ── FILTROS ── */}
      <section ref={filtrosRef} className="px-6 py-10 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-3 gap-4">
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategoria(cat)}
              className={`filtro-btn py-5 rounded-xl font-bold text-sm transition-all
                ${categoriaActiva === cat
                  ? 'bg-[#00e5a0] text-[#1a2332] shadow-lg ring-2 ring-[#00c989]'
                  : 'bg-[#00e5a0] text-[#1a2332] opacity-70 hover:opacity-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── CATÁLOGO ── */}
      <section id="catalogo" className="pb-12 px-6 max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Nuestros productos</p>
            <h2 className="text-xl font-bold text-[#1a2332]">
              {categoriaActiva === 'Todos' ? 'Todos los productos' : categoriaActiva}
            </h2>
          </div>
          <div className="relative hidden md:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={textoBusqueda}
              onChange={e => { setTextoBusqueda(e.target.value); setItemsVisibles(6) }}
              placeholder="Buscar..."
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e5a0] focus:outline-none text-sm w-52"
            />
          </div>
        </div>

        <div className="relative mb-6 md:hidden">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={textoBusqueda}
            onChange={e => { setTextoBusqueda(e.target.value); setItemsVisibles(6) }}
            placeholder="Buscar producto..."
            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00e5a0] focus:outline-none text-sm"
          />
        </div>

        {/* Botón agregar — solo admin */}
        {isAdmin && (
          <div className="flex justify-end mb-4">
            <button onClick={handleAgregar} className="btn-primary text-sm">
              + Agregar Producto
            </button>
          </div>
        )}

        {/* Contenido */}
        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : apiError ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4 text-sm">{apiError}</p>
            <button onClick={cargar} className="btn-primary text-sm">Reintentar</button>
          </div>
        ) : categoriaActiva !== 'Todos' ? (
          /* ── Vista de una sola categoría ── */
          productosFiltrados.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p>No se encontraron productos</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosVisibles.map(p => (
                  <div key={p.id} className="product-card-anim h-full">
                    <ProductCard producto={p} isAdmin={isAdmin} onEdit={handleEditar} onDelete={handleEliminar} />
                  </div>
                ))}
              </div>
              {hayMas && (
                <div className="text-center mt-10">
                  <button onClick={() => setItemsVisibles(v => v + 6)} className="btn-outline">
                    Cargar más
                  </button>
                </div>
              )}
            </>
          )
        ) : (
          /* ── Vista de todas las categorías: 3 secciones ── */
          <div className="flex flex-col gap-14">
            {CATEGORIAS.map((cat, catIdx) => {
              const items = productosDeCat(cat)
              if (items.length === 0 && textoBusqueda) return null
              return (
                <div key={cat} id={`sec-${cat}`}>
                  {/* Cabecera de sección */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[#00e5a0]">{CAT_ICONS_LG[cat]}</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Categoría</p>
                      <h2 className="text-xl font-bold text-[#1a2332]">{cat}</h2>
                    </div>
                    <span className="ml-auto text-xs bg-[#00e5a0]/20 text-[#00b37a] font-semibold px-3 py-1 rounded-full">
                      {items.length} {items.length === 1 ? 'producto' : 'productos'}
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-gray-400 text-sm py-6 text-center">No hay productos en esta categoría</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map(p => (
                        <div key={p.id} className="product-card-anim h-full">
                          <ProductCard producto={p} isAdmin={isAdmin} onEdit={handleEditar} onDelete={handleEliminar} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Divisor entre secciones (excepto la última) */}
                  {catIdx < CATEGORIAS.length - 1 && (
                    <div className="mt-14 border-b border-gray-200" />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── BANNER ── */}
      <section className="grid grid-cols-4">
        <div className="h-28 bg-[#00e5a0]" />
        <div className="h-28" style={{ background: 'repeating-linear-gradient(45deg, #00e5a0 0px, #00e5a0 6px, #1a2332 6px, #1a2332 18px)' }} />
        <div className="h-28 bg-[#00e5a0] opacity-60" />
        <div className="h-28 bg-[#1a2332]" />
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <p className="text-center text-xs text-[#00b37a] font-semibold uppercase tracking-widest mb-3">¿Por qué elegirnos?</p>
        <h2 className="text-center text-2xl font-bold text-[#1a2332] mb-14">Lo que nos hace diferentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Envío Rápido',
              desc:  'Entrega en 3-5 días hábiles a todo el país con tracking en tiempo real.',
              icon: (
                <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="14" width="28" height="22" rx="3" />
                  <path d="M30 20h8l6 8v8h-14V20z" />
                  <circle cx="10" cy="38" r="4" fill="currentColor" stroke="none" />
                  <circle cx="36" cy="38" r="4" fill="currentColor" stroke="none" />
                  <path d="M6 20h16" />
                  <path d="M6 25h10" />
                </svg>
              ),
            },
            {
              title: 'Garantía Total',
              desc:  '12 meses de garantía en todos los productos. Devoluciones sin preguntas.',
              icon: (
                <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M24 4L6 12v14c0 10 7.6 18.9 18 22 10.4-3.1 18-12 18-22V12L24 4z" />
                  <polyline points="16,24 21,29 33,18" />
                </svg>
              ),
            },
            {
              title: 'Soporte 24/7',
              desc:  'Atención especializada en cualquier momento. Tiempo de respuesta menor a 2 h.',
              icon: (
                <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 20C8 12.3 15.2 6 24 6s16 6.3 16 14" />
                  <rect x="4"  y="20" width="8"  height="14" rx="4" />
                  <rect x="36" y="20" width="8"  height="14" rx="4" />
                  <path d="M44 34c0 5.5-8.9 8-20 8" />
                  <circle cx="24" cy="42" r="2" fill="currentColor" stroke="none" />
                </svg>
              ),
            },
          ].map(f => (
            <div
              key={f.title}
              className="group flex flex-col items-center text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#1a2332] flex items-center justify-center mb-6 text-[#00e5a0] group-hover:bg-[#00e5a0] group-hover:text-[#1a2332] transition-colors duration-300">
                {f.icon}
              </div>
              <h3 className="font-bold text-[#1a2332] text-base mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#1a2332] py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { valor: '+500',  label: 'Clientes satisfechos' },
            { valor: '+120',  label: 'Productos en catálogo' },
            { valor: '99%',   label: 'Uptime garantizado' },
            { valor: '< 2h',  label: 'Tiempo de respuesta' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-black text-[#00e5a0] mb-1">{s.valor}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a2332] text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="grid grid-cols-2 gap-2 w-20 mb-4">
              <div className="w-8 h-8 bg-[#00e5a0] rounded-sm" />
              <div className="w-8 h-8 bg-[#00e5a0] rounded-sm opacity-60" />
              <div className="w-8 h-8 bg-white/20 rounded-sm" />
              <div className="w-8 h-8 bg-[#00e5a0] rounded-sm opacity-30" />
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">Tu tienda de tecnología de confianza.</p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">Productos</p>
            <ul className="flex flex-col gap-2 text-gray-400 text-xs">
              <li className="hover:text-[#00e5a0] cursor-pointer transition-colors">Hardware</li>
              <li className="hover:text-[#00e5a0] cursor-pointer transition-colors">Software</li>
              <li className="hover:text-[#00e5a0] cursor-pointer transition-colors">Servicios</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">Empresa</p>
            <ul className="flex flex-col gap-2 text-gray-400 text-xs">
              <li className="hover:text-[#00e5a0] cursor-pointer transition-colors">Nosotros</li>
              <li className="hover:text-[#00e5a0] cursor-pointer transition-colors">Blog</li>
              <li className="hover:text-[#00e5a0] cursor-pointer transition-colors">Contacto</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">Legal</p>
            <ul className="flex flex-col gap-2 text-gray-400 text-xs">
              <li className="hover:text-[#00e5a0] cursor-pointer transition-colors">Privacidad</li>
              <li className="hover:text-[#00e5a0] cursor-pointer transition-colors">Términos</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-gray-500 text-xs">
          © 2025 Turing-IA Tech Catalog. Todos los derechos reservados.
        </div>
      </footer>

      {/* ── MODALES ── */}
      <ProductForm
        open={formOpen}
        producto={productoEdit}
        onClose={() => setFormOpen(false)}
        onSaved={handleGuardado}
      />

      <ConfirmModal
        open={confirmOpen}
        titulo="Eliminar producto"
        mensaje={`¿Estás seguro de que deseas eliminar "${productoDelete?.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleteLoading}
        onConfirm={confirmarEliminar}
        onCancel={() => { setConfirmOpen(false); setProductoDelete(null) }}
      />

      {/* ── TOAST ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                        bg-[#1a2332] text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl
                        animate-bounce-once">
          {toast}
        </div>
      )}
    </div>
  )
}
