-- ============================================================
-- Turing-IA Tech Catalog — Seed SQL
-- Ejecutar DESPUÉS de schema.sql:
--   mysql -u root -p turing_catalog < database/seed.sql
-- ============================================================

USE turing_catalog;

-- ------------------------------------------------------------
-- Roles del sistema
-- ------------------------------------------------------------
INSERT INTO roles (id, nombre_rol) VALUES
  (1, 'Admin'),
  (2, 'User');

-- ------------------------------------------------------------
-- Usuarios de prueba
-- Ambos hashes corresponden a la contraseña "admin123"
-- Generado con bcrypt, salt rounds = 10
-- ------------------------------------------------------------
INSERT INTO usuarios (nombre, email, password_hash, role_id) VALUES
  (
    'Administrador Turing',
    'admin@turing.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    1
  ),
  (
    'Usuario Demo',
    'user@turing.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    2
  );

-- ------------------------------------------------------------
-- Productos — 2 Hardware, 2 Software, 2 Servicios
-- ------------------------------------------------------------
INSERT INTO productos (nombre, descripcion, precio, categoria, imagen_url, stock) VALUES

  -- HARDWARE
  (
    'NVIDIA RTX 4090 24GB',
    'GPU de alto rendimiento para gaming 4K, diseño 3D y cargas de trabajo de IA. Arquitectura Ada Lovelace con 16,384 núcleos CUDA y memoria GDDR6X.',
    1299.99,
    'Hardware',
    'https://placehold.co/400x225/1a2332/00e5a0?text=RTX+4090',
    5
  ),
  (
    'Intel Core i9-14900K',
    'Procesador flagship de 14ª generación con 24 núcleos (8P+16E), 6.0 GHz boost. Ideal para workstations, streaming y renderizado profesional.',
    589.99,
    'Hardware',
    'https://placehold.co/400x225/1a2332/00e5a0?text=i9-14900K',
    8
  ),

  -- SOFTWARE
  (
    'Adobe Creative Cloud',
    'Suite completa de aplicaciones creativas: Photoshop, Illustrator, Premiere Pro, After Effects y más de 20 apps. Licencia anual con 100 GB en nube.',
    54.99,
    'Software',
    'https://placehold.co/400x225/1a2332/00e5a0?text=Adobe+CC',
    999
  ),
  (
    'AutoCAD 2025',
    'Software profesional de diseño asistido por computadora 2D/3D para ingeniería civil, arquitectura y manufactura. Incluye herramientas de colaboración en nube.',
    220.00,
    'Software',
    'https://placehold.co/400x225/1a2332/00e5a0?text=AutoCAD+2025',
    50
  ),

  -- SERVICIOS
  (
    'Soporte Técnico 24/7',
    'Plan anual de soporte remoto especializado con tiempo de respuesta garantizado menor a 2 horas. Incluye monitoreo proactivo, actualizaciones y respaldo mensual.',
    299.00,
    'Servicios',
    'https://placehold.co/400x225/1a2332/00e5a0?text=Soporte+247',
    20
  ),
  (
    'Setup e Instalación Pro',
    'Servicio de instalación y configuración profesional de hardware y software a domicilio o remoto. Incluye optimización del sistema, drivers y pruebas de rendimiento.',
    89.99,
    'Servicios',
    'https://placehold.co/400x225/1a2332/00e5a0?text=Instalacion+Pro',
    15
  );
