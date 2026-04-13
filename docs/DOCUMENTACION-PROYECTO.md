# Turing-IA Tech Catalog — Documentación Completa

---

## Índice

1. [Descripción General](#1-descripción-general)
2. [Estructura del Proyecto](#2-estructura-del-proyecto)
3. [Base de Datos](#3-base-de-datos)
4. [Backend — Express API](#4-backend--express-api)
5. [Frontend — React + Vite](#5-frontend--react--vite)
6. [Hooks Implementados](#6-hooks-implementados)
7. [Animaciones GSAP](#7-animaciones-gsap)
8. [Autenticación y Roles](#8-autenticación-y-roles)
9. [Deploy — Producción](#9-deploy--producción)
10. [Credenciales de Prueba](#10-credenciales-de-prueba)

---

## 1. Descripción General

**Turing-IA Tech Catalog** es una aplicación web full-stack de catálogo de productos tecnológicos. Permite a visitantes explorar productos por categoría, y a administradores gestionar el inventario completo (crear, editar y eliminar productos) desde el mismo frontend.

| Tecnología | Uso |
|-----------|-----|
| React 19 + Vite 8 | Frontend SPA |
| Tailwind CSS v4 | Estilos (sintaxis `@theme`) |
| GSAP 3 + @gsap/react | Animaciones |
| Express 5 | API REST backend |
| MySQL 8 | Base de datos relacional |
| JWT + bcryptjs | Autenticación segura |
| Railway | Hosting backend + DB |
| Netlify | Hosting frontend |

---

## 2. Estructura del Proyecto

```
turing-ia/
├── backend/                    # API REST con Express
│   ├── server.js               # Punto de entrada, middlewares globales
│   ├── .env                    # Variables de entorno (no incluir en Git)
│   └── src/
│       ├── config/
│       │   └── db.js           # Pool de conexiones MySQL
│       ├── controllers/
│       │   ├── authController.js       # Login con JWT
│       │   └── productosController.js  # CRUD productos
│       ├── middlewares/
│       │   ├── checkAuth.js    # Verifica token JWT
│       │   ├── checkAdmin.js   # Verifica rol Admin
│       │   └── errorHandler.js # Manejador global de errores
│       └── routes/
│           ├── auth.routes.js       # POST /api/auth/login
│           └── productos.routes.js  # GET/POST/PUT/DELETE /api/productos
│
├── frontend/                   # SPA React + Vite
│   ├── index.html
│   ├── netlify.toml            # Configuración redirects para React Router
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx            # Entrada React, BrowserRouter
│       ├── index.css           # Tailwind @theme, componentes globales
│       ├── gsap.config.js      # Registro global de plugins GSAP
│       ├── components/
│       │   ├── Navbar.jsx      # Barra de navegación + scroll progress
│       │   ├── ProductCard.jsx # Tarjeta con efecto 3D tilt
│       │   ├── ProductForm.jsx # Modal crear/editar producto (admin)
│       │   ├── ConfirmModal.jsx# Modal confirmación de eliminación
│       │   ├── Spinner.jsx     # Indicador de carga
│       │   └── Logo.jsx        # Logo SVG "TURING" (chip)
│       ├── context/
│       │   └── AuthContext.jsx # Estado global de autenticación
│       ├── data/
│       │   └── productImages.js# Galería de 5 imágenes por producto
│       ├── hooks/
│       │   └── useMagnet.js    # Hook efecto magnético en botones
│       ├── pages/
│       │   ├── CatalogPage.jsx # Página principal con catálogo
│       │   ├── ProductDetailPage.jsx # Detalle de producto
│       │   └── LoginPage.jsx   # Formulario de login
│       └── services/
│           └── api.js          # Llamadas fetch a la API REST
│
├── database/
│   ├── schema.sql              # Creación de tablas
│   └── seed.sql                # Datos iniciales (roles, usuarios, productos)
│
└── docs/
    └── DOCUMENTACION-PROYECTO.md  # Este archivo
```

---

## 3. Base de Datos

### Normalización 3FN

La base de datos `turing_catalog` cumple Tercera Forma Normal:

- Sin grupos repetitivos (1FN)
- Todos los atributos dependen de la clave primaria completa (2FN)
- Sin dependencias transitivas — `role_id` en `usuarios` referencia la tabla `roles` (3FN)

### Tablas

#### `roles`
```sql
id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
nombre_rol ENUM('Admin', 'User') NOT NULL
```

#### `usuarios`
```sql
id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
nombre        VARCHAR(100) NOT NULL
email         VARCHAR(150) NOT NULL UNIQUE
password_hash VARCHAR(255) NOT NULL          -- bcrypt, 10 rounds
role_id       INT UNSIGNED NOT NULL          -- FK → roles(id)
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### `productos`
```sql
id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
nombre      VARCHAR(200) NOT NULL
descripcion TEXT
precio      DECIMAL(10,2) NOT NULL
categoria   ENUM('Hardware', 'Software', 'Servicios') NOT NULL
imagen_url  VARCHAR(500)
stock       INT UNSIGNED DEFAULT 0
activo      TINYINT(1) DEFAULT 1             -- soft delete
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Relaciones

```
roles (1) ──── (N) usuarios
```

---

## 4. Backend — Express API

### Configuración de seguridad (`server.js`)

```js
app.use(helmet())                          // HTTP headers seguros
app.use(cors({ origin: FRONTEND_URL }))    // Solo acepta el frontend
app.use(express.json({ limit: '10kb' }))   // Limita tamaño del body

// Rate limiting global: 100 req / 15 min por IP
app.use(globalLimiter)

// Rate limiting estricto en login: 10 intentos / 15 min
app.use('/api/auth', loginLimiter, authRoutes)
```

### Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/auth/login` | ❌ Pública | Genera JWT |
| `GET` | `/api/productos` | ❌ Pública | Lista productos activos |
| `POST` | `/api/productos` | ✅ Admin | Crea producto |
| `PUT` | `/api/productos/:id` | ✅ Admin | Actualiza producto |
| `DELETE` | `/api/productos/:id` | ✅ Admin | Soft delete |

### Middlewares de autenticación

**`checkAuth.js`** — verifica que el header `Authorization: Bearer <token>` sea válido:
```js
const decoded = jwt.verify(token, process.env.JWT_SECRET)
req.user = decoded
```

**`checkAdmin.js`** — verifica que el rol sea Admin (role_id = 1):
```js
if (req.user.role_id !== 1)
  return res.status(403).json({ error: 'Acceso denegado' })
```

### Validaciones en controladores

- `nombre`: 2–150 caracteres, string
- `precio`: número positivo
- `categoria`: debe ser `Hardware`, `Software` o `Servicios`
- `stock`: entero ≥ 0
- `email`: debe contener `@`, máximo 254 chars
- `password`: 6–128 caracteres

---

## 5. Frontend — React + Vite

### Flujo de la aplicación

```
/ (CatalogPage)
   ↓ clic en producto
/producto/:id (ProductDetailPage)

/login (LoginPage)
   ↓ login exitoso
/ (CatalogPage con acceso admin)
```

### AuthContext

Estado global de autenticación guardado en `localStorage`:

```js
const { user, token, isAuthenticated, isAdmin, login, logout } = useAuth()
```

- `isAdmin` → `user.role_id === 1`
- El token se envía en cada petición protegida como `Authorization: Bearer <token>`

### Consumo de API (`services/api.js`)

Todas las peticiones al backend pasan por este archivo:

```js
getProductos()                        // GET /api/productos
login(email, password)                // POST /api/auth/login
createProducto(data, token)           // POST /api/productos
updateProducto(id, data, token)       // PUT /api/productos/:id
deleteProducto(id, token)             // DELETE /api/productos/:id
```

Si la API falla, el catálogo carga datos mock locales como fallback.

### Catálogo — interactividad DOM

- **Filtrado por categoría**: botones Hardware / Software / Servicios filtran los productos en tiempo real
- **3 secciones**: en vista "Todos", los productos se agrupan por categoría con su propio encabezado
- **Cargar más**: en vista de categoría individual, muestra 6 productos y carga 6 más al hacer clic
- **Búsqueda**: input que filtra por nombre en tiempo real

### Panel Admin

Visible solo cuando `isAdmin === true`:

- **+ Agregar Producto** → abre `ProductForm` en modo crear
- **Editar** en cada card → abre `ProductForm` en modo editar (pre-rellena el formulario)
- **Eliminar** en cada card → abre `ConfirmModal` → llama `DELETE /api/productos/:id`
- Toast de confirmación después de cada acción

---

## 6. Hooks Implementados

### `useMagnet(strength)` — `src/hooks/useMagnet.js`

Efecto magnético: el elemento se desplaza suavemente hacia el cursor al hacer hover.

```js
const magnetCart    = useMagnet(0.4)
const magnetContact = useMagnet(0.4)

<button ref={magnetCart}>Agregar al carrito</button>
<button ref={magnetContact}>Contactar proveedor</button>
```

**Implementación:**
- Escucha `mousemove` y calcula el desplazamiento `(clientX - centerX) * strength`
- Usa `gsap.to(el, { x: dx, y: dy })` para mover el elemento
- Al `mouseleave` regresa a `x: 0, y: 0` con `elastic.out(1, 0.4)`

**Usado en:** `ProductDetailPage.jsx` — botones CTA del detalle de producto

---

### `useGSAP` (de `@gsap/react`)

Hook oficial de GSAP para React. Garantiza limpieza automática de animaciones al desmontar el componente.

```js
useGSAP(() => {
  gsap.fromTo('.hero-titulo', { opacity: 0 }, { opacity: 1 })
}, { scope: heroRef, dependencies: [producto] })
```

**Usado en:**
- `CatalogPage.jsx` — animación del hero y filtros
- `ProductDetailPage.jsx` — animación del hero y columnas
- `Navbar.jsx` — slide-down al montar

---

### `useState` / `useEffect` / `useRef` (React built-in)

| Hook | Uso principal |
|------|--------------|
| `useState` | Estado de productos, loading, filtros, modales, toast, cantidad, imgIndex |
| `useEffect` | Carga de productos desde API, animaciones con ScrollTrigger, contador de precio |
| `useRef` | Referencias a elementos DOM para GSAP (heroRef, colIzqRef, colDerRef, priceRef, imgRef) |

---

## 7. Animaciones GSAP

### Configuración global (`gsap.config.js`)

```js
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin }    from 'gsap/TextPlugin'

gsap.registerPlugin(ScrollTrigger, TextPlugin)
export { gsap, ScrollTrigger, TextPlugin }
```

### Animaciones implementadas

| Componente | Animación | Técnica |
|-----------|-----------|---------|
| `CatalogPage` Hero | Título se escribe letra a letra | `TextPlugin` + `gsap.to({ text })` |
| `CatalogPage` Hero | Badge, subtítulo y botones aparecen | `gsap.fromTo` con stagger |
| `CatalogPage` Filtros | Botones aparecen en cascada | `gsap.fromTo` con stagger 0.1 |
| `CatalogPage` Cards | Cards aparecen desde abajo al cargar | `gsap.fromTo` con stagger 0.07 |
| `Navbar` | Barra desliza desde arriba al montar | `gsap.from` y: -60 |
| `Navbar` | Barra de progreso de scroll | `ScrollTrigger` + `scaleX` |
| `ProductCard` | Efecto 3D tilt en hover | `rotateX/rotateY` + `transformPerspective: 800` |
| `ProductDetailPage` | Breadcrumb, título y precio aparecen | Timeline con `fromTo` en cascada |
| `ProductDetailPage` | Columnas izquierda/derecha entran | `fromTo` desde X ±25 |
| `ProductDetailPage` | Precio cuenta desde $0.00 | `gsap.to(counter, { val })` + `onUpdate` |
| `ProductDetailPage` | Specs animadas al scroll | `ScrollTrigger` con `once: true` |
| `ProductDetailPage` | Planes aparecen al scroll | `ScrollTrigger` con stagger |
| `ProductDetailPage` | Cambio de imagen con fade | `gsap.to` opacity + scale |
| Botones CTA | Efecto magnético hacia el cursor | `useMagnet` hook |

> **Importante:** Todas las animaciones usan `gsap.fromTo` (no `gsap.from`) para garantizar que los elementos siempre lleguen al estado visible, independientemente de si la animación se interrumpe.

---

## 8. Autenticación y Roles

### Flujo de login

```
Usuario ingresa email + password
        ↓
POST /api/auth/login
        ↓
bcrypt.compare(password, hash_en_DB)
        ↓
jwt.sign({ id, email, role_id }, JWT_SECRET, { expiresIn: '8h' })
        ↓
Frontend guarda { token, user } en localStorage
        ↓
AuthContext distribuye isAuthenticated, isAdmin, token
```

### Diferencia de acceso por rol

| Acción | User | Admin |
|--------|------|-------|
| Ver catálogo | ✅ | ✅ |
| Ver detalle de producto | ✅ | ✅ |
| Crear producto | ❌ | ✅ |
| Editar producto | ❌ | ✅ |
| Eliminar producto | ❌ | ✅ |

### Soft Delete

Los productos no se borran físicamente de la DB. Se marca `activo = 0`:
```sql
UPDATE productos SET activo = 0 WHERE id = ?
```
El `GET /api/productos` solo devuelve `WHERE activo = 1`.

---

## 9. Deploy — Producción

### Arquitectura de producción

```
Usuario
  ↓
Netlify (frontend estático)
  https://kaleidoscopic-semolina-4c2077.netlify.app
  ↓
Railway (backend Express)
  https://agjp-turing-ia-production.up.railway.app
  ↓
Railway MySQL
  Base de datos: turing_catalog
```

### Frontend — Netlify

- **Build:** `npm run build` dentro de `frontend/`
- **Publish directory:** `frontend/dist`
- **Redirects:** `netlify.toml` redirige todas las rutas a `index.html` para React Router
- **Variable de entorno:**
  ```
  VITE_API_URL = https://agjp-turing-ia-production.up.railway.app/api
  ```

### Backend — Railway

- **Root Directory:** `backend/`
- **Start command:** `node server.js`
- **Variables de entorno:**
  ```
  DB_HOST      = (MYSQLHOST de Railway)
  DB_USER      = root
  DB_PASS      = (MYSQLPASSWORD de Railway)
  DB_NAME      = turing_catalog
  DB_PORT      = 3306
  JWT_SECRET   = (string aleatorio seguro)
  FRONTEND_URL = https://kaleidoscopic-semolina-4c2077.netlify.app
  NODE_ENV     = production
  ```

### Base de datos — Railway MySQL

- Se ejecutó `schema.sql` para crear las 3 tablas
- Se ejecutó `seed.sql` para insertar los datos iniciales
- Conexión interna entre el servicio backend y MySQL usando variables de Railway

---

## 10. Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| **Admin** | `admin@turing.com` | `admin123` |
| **User** | `user@turing.com` | `admin123` |

---

*Documentación generada para Turing-IA Tech Catalog — Proyecto académico full-stack.*
