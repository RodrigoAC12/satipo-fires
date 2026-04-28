import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configuración de base de datos con Supabase/Render
DATABASE_URL = os.getenv("DATABASE_URL")

# Fix de compatibilidad: SQLAlchemy requiere 'postgresql://' en lugar de 'postgres://'
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

SQLALCHEMY_DATABASE_URL = DATABASE_URL

# Crear engine con pool_pre_ping para mantener conexión activa
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True
)

# Configurar sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()

# Función de dependencia para FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 6. FUNCIÓN DE DEPENDENCIA PARA FASTAPI
# Esto asegura que cada vez que un usuario haga una petición, se abra y cierre correctamente la conexión.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()