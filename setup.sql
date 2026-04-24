-- ================================================
-- SCRIPT DE CONFIGURACIÓN - SATIPO FIRE PREDICTION
-- ================================================
-- Ejecuta este script en PostgreSQL para configurar correctamente
-- Usuarios: Abre pgAdmin o psql y copia-pega estos comandos
-- ================================================

-- 1. Crear usuario (si no existe)
CREATE USER admin WITH PASSWORD 'admin';
ALTER USER admin CREATEDB;

-- 2. Crear base de datos
CREATE DATABASE satipo_fires OWNER admin;

-- 3. Conectar a la BD y configurar encoding
\c satipo_fires

-- 4. Configurar cliente y servidor en UTF-8
ALTER DATABASE satipo_fires SET client_encoding = 'UTF8';
ALTER DATABASE satipo_fires SET server_encoding = 'UTF8';
ALTER DATABASE satipo_fires SET default_transaction_encoding = 'UTF8';

-- 5. Dar permisos completos al usuario
GRANT ALL PRIVILEGES ON DATABASE satipo_fires TO admin;
GRANT USAGE ON SCHEMA public TO admin;
GRANT CREATE ON SCHEMA public TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admin;

-- 6. Verificar que todo está bien
SELECT datname, encoding, datcollate FROM pg_database WHERE datname = 'satipo_fires';

-- ================================================
-- INSTRUCCIONES DE USO:
-- ================================================
-- 1. Abre pgAdmin (interfaz gráfica) o psql (línea de comandos)
-- 2. Conecta como superusuario (postgres)
-- 3. Copia todo el contenido de este archivo
-- 4. Pega y ejecuta
-- 5. Deberías ver:
--    datname      | encoding | datcollate
--    satipo_fires |        6 | C
-- ================================================
