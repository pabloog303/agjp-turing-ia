import { useState, useEffect, useRef } from 'react'
import Navbar      from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import Spinner     from '../components/Spinner'
import { getProductos } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../gsap.config.js'

const CATEGORIAS = ['Hardware', 'Software', 'Servicios']

// Mock data — se usa cuando el backend no está disponible
const MOCK_PRODUCTOS = [
  { id:1, nombre:'NVIDIA RTX 4090 24GB',     descripcion:'GPU de alto rendimiento para gaming 4K, diseño 3D y cargas de trabajo de IA. Arquitectura Ada Lovelace con 16,384 núcleos CUDA.', precio:1299.99, categoria:'Hardware', imagen_url:'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=600&q=80', stock:5   },
  { id:2, nombre:'Intel Core i9-14900K',      descripcion:'Procesador flagship de 14ª generación con 24 núcleos, 6.0 GHz boost. Ideal para workstations, streaming y renderizado profesional.',  precio:589.99,  categoria:'Hardware', imagen_url:'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80', stock:8   },
  { id:3, nombre:'Adobe Creative Cloud',      descripcion:'Suite completa de aplicaciones creativas: Photoshop, Illustrator, Premiere Pro, After Effects y más de 20 apps. 100 GB en nube.',       precio:54.99,   categoria:'Software', imagen_url:'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80', stock:999 },
  { id:4, nombre:'AutoCAD 2025',              descripcion:'Software profesional de diseño CAD 2D/3D para ingeniería civil, arquitectura y manufactura. Incluye herramientas de colaboración.',      precio:220.00,  categoria:'Software', imagen_url:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80', stock:50  },
  { id:5, nombre:'Soporte Técnico 24/7',      descripcion:'Plan anual de soporte remoto especializado con tiempo de respuesta garantizado menor a 2 horas. Monitoreo proactivo y respaldo mensual.', precio:299.00,  categoria:'Servicios',imagen_url:'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80', stock:20  },
  { id:6, nombre:'Setup e Instalación Pro',   descripcion:'Instalación y configuración profesional de hardware y software a domicilio o remoto. Incluye optimización del sistema y pruebas.',        precio:89.99,   categoria:'Servicios',imagen_url:'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80', stock:15  },
]

export default function CatalogPage() {
  const { isAdmin } = useAuth()

  const [productos,       setProductos]       = useState([])
  const [loading,         setLoading]         = useState(true)
  const [apiError,        setApiError]        = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [textoBusqueda,   setTextoBusqueda]   = useState('')
  const [itemsVisibles,   setItemsVisibles]   = useState(6)

  const heroRef    = useRef(null)
  const filtrosRef = useRef(null)
  const cardsRef   = useRef(null)

  // Animación hero al montar
  useGSAP(() => {
    const tl = gsap.timeline()
    tl.from('.hero-titulo', { y: 30, opacity: 0, duration: 0.7, ease: 'power2.out' })
      .from('.hero-subtitulo', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .from('.hero-btn', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.35')
  }, { scope: heroRef })

  // Animación filtros al montar
  useGSAP(() => {
    gsap.from('.filtro-btn', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.3,
    })
  }, { scope: filtrosRef })

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

  // Animación cards con ScrollTrigger — se re-ejecuta al cambiar productos visibles
  useEffect(() => {
    if (loading || !cardsRef.current) return
    const cards = cardsRef.current.querySelectorAll('.product-card-anim')
    if (!cards.length) return

    gsap.from(cards, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cardsRef.current,
        start: 'top 85%',
        once: true,
      },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [loading, productos, categoriaActiva, textoBusqueda])

  function toggleCategoria(cat) {
    setCategoriaActiva(prev => prev === cat ? 'Todos' : cat)
    setItemsVisibles(6)
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
      <section ref={heroRef} className="bg-[#1a2332] text-white py-20 text-center px-4">
        <h1 className="hero-titulo text-4xl font-bold leading-tight">
          Descubre los mejores gadgets tech
        </h1>
        <p className="hero-subtitulo text-gray-400 mt-3 text-base">
          Hardware, Software y Servicios de última generación
        </p>
        <button
          className="hero-btn btn-primary mt-8"
          onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Explorar catálogo
        </button>
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

        {isAdmin && (
          <div className="flex justify-end mb-4">
            <button className="btn-primary text-sm">+ Agregar Producto</button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : apiError ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4 text-sm">{apiError}</p>
            <button onClick={cargar} className="btn-primary text-sm">Reintentar</button>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <>
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosVisibles.map(p => (
                <div key={p.id} className="product-card-anim">
                  <ProductCard
                    producto={p}
                    isAdmin={isAdmin}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
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
        )}
      </section>

      {/* ── BANNER ── */}
      <section className="grid grid-cols-4">
        <div className="h-28 bg-[#00e5a0]" />
        <div
          className="h-28"
          style={{
            background: 'repeating-linear-gradient(45deg, #00e5a0 0px, #00e5a0 6px, #1a2332 6px, #1a2332 18px)'
          }}
        />
        <div className="h-28 bg-[#00e5a0] opacity-60" />
        <div className="h-28 bg-[#1a2332]" />
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-10">
          ¿Por qué elegirnos?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { title: 'Envío Rápido',   desc: 'Entrega en 3-5 días hábiles a todo el país' },
            { title: 'Garantía Total', desc: '12 meses de garantía en todos los productos' },
            { title: 'Soporte 24/7',   desc: 'Atención especializada en cualquier momento' },
          ].map(f => (
            <div key={f.title} className="flex flex-col items-center gap-4">
              <div className="w-28 h-28 bg-[#1a2332] rounded-full" />
              <h3 className="font-bold text-[#1a2332] text-base">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
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
            <p className="text-gray-400 text-xs leading-relaxed">
              Tu tienda de tecnología de confianza.
            </p>
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
    </div>
  )
}
