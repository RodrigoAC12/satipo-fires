from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Credenciales de nuestro contenedor Docker (PostgreSQL + PostGIS)
# Formato: postgresql://usuario:contraseña@servidor:puerto/nombre_bd
URL_BASE_DATOS = "postgresql://admin:admin@localhost:5432/satipo_fires"

# Creamos el "motor" que se encarga de la comunicación
engine = create_engine(URL_BASE_DATOS)

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