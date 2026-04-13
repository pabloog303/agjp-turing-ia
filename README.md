# Turing-IA Tech Catalog

Catálogo de productos tecnológicos full-stack con panel de administración, autenticación JWT y animaciones GSAP.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite 8 + Tailwind CSS v4 + GSAP |
| Backend | Node.js + Express 5 |
| Base de datos | MySQL 8 |
| Autenticación | JWT (jsonwebtoken) + bcryptjs |
| Seguridad | helmet + express-rate-limit |

---

## Requisitos del sistema

- Node.js ≥ 18
- npm ≥ 9
- MySQL ≥ 8.0

---

## Configuración local

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd turing-ia
```

### 2. Base de datos

```bash
# Crear esquema y tablas
mysql -u root -p < database/schema.sql

# Insertar datos de prueba
mysql -u root -p < database/seed.sql
```

### 3. Backend

```bash
cd backend
npm install
```

Crear el archivo `.env` en `backend/`:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_password_mysql
DB_NAME=turing_catalog
JWT_SECRET=cambia_esto_por_una_cadena_segura_de_64_caracteres
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Iniciar el servidor:

```bash
npm run dev    # desarrollo con nodemon
# o
node server.js # producción
```

El backend estará en: `http://localhost:3001`

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

La app estará en: `http://localhost:5173`

---

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@turing.com | admin123 |
| User | user@turing.com | admin123 |

> El usuario **Admin** puede crear, editar y eliminar productos.  
> El usuario **User** solo puede ver el catálogo.

---

## Estructura del proyecto

```
turing-ia/
├── backend/
│   ├── server.js                  # Punto de entrada Express
│   ├── .env                       # Variables de entorno (no commitear)
│   └── src/
│       ├── config/
│       │   └── db.js              # Pool de conexión MySQL
│       ├── controllers/
│       │   ├── authController.js  # Login + JWT
│       │   └── productosController.js  # CRUD productos
│       ├── middlewares/
│       │   ├── checkAuth.js       # Verifica JWT
│       │   ├── checkAdmin.js      # Verifica role_id = 1
│       │   └── errorHandler.js    # Manejo centralizado de errores
│       └── routes/
│           ├── auth.routes.js
│           └── productos.routes.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Logo.jsx
│       │   ├── ProductCard.jsx
│       │   ├── ProductForm.jsx    # Modal crear/editar (admin)
│       │   ├── ConfirmModal.jsx   # Confirmación eliminar (admin)
│       │   └── Spinner.jsx
│       ├── context/
│       │   └── AuthContext.jsx    # Estado global de sesión
│       ├── data/
│       │   └── productImages.js   # Galería de imágenes por producto
│       ├── pages/
│       │   ├── CatalogPage.jsx
│       │   ├── ProductDetailPage.jsx
│       │   └── LoginPage.jsx
│       └── services/
│           └── api.js             # Capa HTTP hacia el backend
└── database/
    ├── schema.sql                 # Definición de tablas
    └── seed.sql                   # Datos iniciales
```

---

## Esquema de base de datos

```
roles
  id          INT PK AUTO_INCREMENT
  nombre_rol  VARCHAR(50) UNIQUE NOT NULL

usuarios
  id             INT PK AUTO_INCREMENT
  nombre         VARCHAR(100) NOT NULL
  email          VARCHAR(150) UNIQUE NOT NULL
  password_hash  VARCHAR(255) NOT NULL
  role_id        INT FK → roles(id)
  created_at     TIMESTAMP DEFAULT NOW()

productos
  id           INT PK AUTO_INCREMENT
  nombre       VARCHAR(150) NOT NULL
  descripcion  TEXT
  precio       DECIMAL(10,2) NOT NULL  CHECK > 0
  categoria    ENUM('Hardware','Software','Servicios') NOT NULL
  imagen_url   VARCHAR(500)
  stock        INT DEFAULT 0           CHECK >= 0
  activo       TINYINT(1) DEFAULT 1    (soft delete)
  created_at   TIMESTAMP DEFAULT NOW()
  updated_at   TIMESTAMP ON UPDATE NOW()
```

Las tres tablas cumplen la **Tercera Forma Normal (3NF)**:
- No hay grupos repetitivos (1NF)
- Todos los atributos dependen de la clave completa (2NF)
- No hay dependencias transitivas; `nombre_rol` está en su propia tabla `roles` (3NF)

---

## API — Endpoints

### Autenticación

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Devuelve JWT + datos del usuario |

### Productos

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/productos` | No | Lista todos los productos activos |
| POST | `/api/productos` | Admin | Crea un nuevo producto |
| PUT | `/api/productos/:id` | Admin | Actualiza campos del producto |
| DELETE | `/api/productos/:id` | Admin | Soft delete (activo = 0) |

Ver la colección Postman completa en: `database/turing-catalog.postman_collection.json`

---

## Comandos disponibles

```bash
# Backend
cd backend
npm run dev        # Servidor con hot-reload (nodemon)
node server.js     # Servidor sin hot-reload

# Frontend
cd frontend
npm run dev        # Servidor de desarrollo Vite
npm run build      # Build de producción
npm run preview    # Preview del build
```

---

## Seguridad implementada

- **helmet** — HTTP security headers (XSS, clickjacking, MIME sniffing)
- **express-rate-limit** — 100 req/15 min global · 10 intentos/15 min en login
- **JWT** — tokens firmados con HS256, expiración 8h
- **bcryptjs** — hashing de contraseñas con salt rounds = 10
- **CORS** — solo el origen configurado en `FRONTEND_URL`
- **Soft delete** — los productos eliminados no se borran físicamente
- **Validación de entrada** — tipos, longitudes y valores permitidos en cada endpoint
