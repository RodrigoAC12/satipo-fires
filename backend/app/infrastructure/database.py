from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.pool import QueuePool
import os
from urllib.parse import quote_plus
import logging
import sys

logger = logging.getLogger(__name__)

# ============ CONFIGURACIÓN DE BASE DE DATOS ============
# Credenciales de nuestro contenedor Docker (PostgreSQL + PostGIS)
# Leer desde variables de entorno o usar valores por defecto
DB_USER = os.getenv('DB_USER', 'admin')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'admin')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'satipo_fires')

logger.info(f"🔌 Intentando conectar a: {DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

try:
    # Codificar la contraseña para manejar caracteres especiales (ñ, ó, etc.)
    # IMPORTANTE: Usar quote_plus para URL encoding
    DB_PASSWORD_ENCODED = quote_plus(DB_PASSWORD)
    
    # Construir URL de conexión con parámetros UTF-8
    URL_BASE_DATOS = (
        f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD_ENCODED}@"
        f"{DB_HOST}:{DB_PORT}/{DB_NAME}"
        f"?client_encoding=utf8&sslmode=prefer"
    )
    
    logger.info(f"📝 URL de conexión: postgresql+psycopg2://{DB_USER}:***@{DB_HOST}:{DB_PORT}/{DB_NAME}")
    
    # Creamos el "motor" que se encarga de la comunicación
    engine = create_engine(
        URL_BASE_DATOS,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,  # Verifica conexiones antes de usarlas
        pool_recycle=3600,   # Recicla conexiones cada hora
        connect_args={
            'client_encoding': 'utf8',
            'connect_timeout': 10,
            'options': '-c client_encoding=utf8'
        },
        echo=False
    )
    
    # Prueba conexión inmediata
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version();"))
        version = result.fetchone()[0]
        logger.info(f"✅ Conexión exitosa: {version.split(',')[0]}")
    
except Exception as e:
    logger.error(f"❌ ERROR CRÍTICO al conectar a PostgreSQL:")
    logger.error(f"   Tipo de error: {type(e).__name__}")
    logger.error(f"   Mensaje: {str(e)}")
    logger.error(f"   ")
    logger.error(f"   SOLUCIONES:")
    logger.error(f"   1. Verifica que PostgreSQL está corriendo en {DB_HOST}:{DB_PORT}")
    logger.error(f"   2. Verifica credenciales en backend/.env")
    logger.error(f"   3. Asegúrate que la base de datos '{DB_NAME}' existe")
    logger.error(f"   4. Si usas contraseña con caracteres especiales, usa ASCII simple")
    logger.error(f"   ")
    logger.error(f"   Ejecuta en PostgreSQL:")
    logger.error(f"   CREATE DATABASE {DB_NAME};")
    logger.error(f"   CREATE USER {DB_USER} WITH PASSWORD 'admin';")
    logger.error(f"   ALTER USER {DB_USER} CREATEDB;")
    logger.error(f"   GRANT ALL PRIVILEGES ON DATABASE {DB_NAME} TO {DB_USER};")
    sys.exit(1)

# Evento para asegurar UTF-8 en cada nueva conexión
@event.listens_for(engine, "connect")
def set_utf8(dbapi_conn, connection_record):
    """Configura UTF-8 explícitamente para todas las conexiones nuevas."""
    try:
        cursor = dbapi_conn.cursor()
        cursor.execute("SET client_encoding TO 'UTF8'")
        cursor.execute("SET server_encoding TO 'UTF8'")
        dbapi_conn.commit()
        cursor.close()
        logger.debug("✅ UTF-8 configurado para nueva conexión")
    except Exception as e:
        logger.warning(f"⚠️  No se pudo forzar UTF-8: {e}")

# Creamos la fábrica de sesiones
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False
)

# Clase base de la que heredarán nuestras tablas
Base = declarative_base()

# Dependencia para inyectar la sesión en nuestras rutas de FastAPI
def get_db():
    """Proporciona una sesión de BD a las rutas."""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Error en sesión de BD: {e}")
        db.rollback()
        raise
    finally:
        db.close()