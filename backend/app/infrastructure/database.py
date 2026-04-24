from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from urllib.parse import quote_plus

# Credenciales de nuestro contenedor Docker (PostgreSQL + PostGIS)
# Formato: postgresql://usuario:contraseña@servidor:puerto/nombre_bd
# Leer desde variables de entorno o usar valores por defecto
DB_USER = os.getenv('DB_USER', 'admin')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'admin')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'satipo_fires')

# Codificar la contraseña para manejar caracteres especiales
DB_PASSWORD_ENCODED = quote_plus(DB_PASSWORD)
URL_BASE_DATOS = f"postgresql://{DB_USER}:{DB_PASSWORD_ENCODED}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Creamos el "motor" que se encarga de la comunicación
engine = create_engine(URL_BASE_DATOS, pool_pre_ping=True)

# Creamos la fábrica de sesiones (cada vez que el backend necesite consultar algo, usará esto)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base de la que heredarán nuestras tablas
Base = declarative_base()

# Dependencia para inyectar la sesión en nuestras rutas de FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Creamos la fábrica de sesiones (cada vez que el backend necesite consultar algo, usará esto)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base de la que heredarán nuestras tablas
Base = declarative_base()

# Dependencia para inyectar la sesión en nuestras rutas de FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()