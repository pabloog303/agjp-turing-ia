-- ============================================================
-- Turing-IA Tech Catalog — Schema SQL
-- Ejecutar: mysql -u root -p < database/schema.sql
-- ============================================================

-- Elimina y recrea la base de datos limpia
DROP DATABASE IF EXISTS turing_catalog;
CREATE DATABASE turing_catalog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE turing_catalog;

-- ------------------------------------------------------------
-- Tabla: roles
-- Catálogo de roles del sistema (Admin / User)
-- ------------------------------------------------------------
CREATE TABLE roles (
  id         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  nombre_rol ENUM('Admin','User') NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla: usuarios
-- Usuarios del sistema con referencia al rol
-- ------------------------------------------------------------
CREATE TABLE usuarios (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  role_id       INT UNSIGNED  NOT NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY  uk_email    (email),
  INDEX       idx_role_id (role_id),
  CONSTRAINT  fk_role FOREIGN KEY (role_id) REFERENCES roles(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla: productos
-- Catálogo de gadgets con soft delete (campo activo)
-- ------------------------------------------------------------
CREATE TABLE productos (
  id          INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(200)      NOT NULL,
  descripcion TEXT,
  precio      DECIMAL(10,2)     NOT NULL,
  categoria   ENUM('Hardware','Software','Servicios') NOT NULL,
  imagen_url  VARCHAR(500)               DEFAULT NULL,
  stock       INT UNSIGNED               DEFAULT 0,
  activo      TINYINT(1)                 DEFAULT 1,
  created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_categoria (categoria),
  INDEX idx_activo    (activo),
  CONSTRAINT chk_precio CHECK (precio >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
