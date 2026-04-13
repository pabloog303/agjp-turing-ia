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
    '$2b$10$6LMXEBOyxIImyxWTUKHd5OFnSZvXyw.eTusEjmthvXl9z8Awdz50K',
    1
  ),
  (
    'Usuario Demo',
    'user@turing.com',
    '$2b$10$6LMXEBOyxIImyxWTUKHd5OFnSZvXyw.eTusEjmthvXl9z8Awdz50K',
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
    'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=600&q=80',
    5
  ),
  (
    'Intel Core i9-14900K',
    'Procesador flagship de 14ª generación con 24 núcleos (8P+16E), 6.0 GHz boost. Ideal para workstations, streaming y renderizado profesional.',
    589.99,
    'Hardware',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80',
    8
  ),

  -- SOFTWARE
  (
    'Adobe Creative Cloud',
    'Suite completa de aplicaciones creativas: Photoshop, Illustrator, Premiere Pro, After Effects y más de 20 apps. Licencia anual con 100 GB en nube.',
    54.99,
    'Software',
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80',
    999
  ),
  (
    'AutoCAD 2025',
    'Software profesional de diseño asistido por computadora 2D/3D para ingeniería civil, arquitectura y manufactura. Incluye herramientas de colaboración en nube.',
    220.00,
    'Software',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    50
  ),

  -- SERVICIOS
  (
    'Soporte Técnico 24/7',
    'Plan anual de soporte remoto especializado con tiempo de respuesta garantizado menor a 2 horas. Incluye monitoreo proactivo, actualizaciones y respaldo mensual.',
    299.00,
    'Servicios',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80',
    20
  ),
  (
    'Setup e Instalación Pro',
    'Servicio de instalación y configuración profesional de hardware y software a domicilio o remoto. Incluye optimización del sistema, drivers y pruebas de rendimiento.',
    89.99,
    'Servicios',
    'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80',
    15
  );
