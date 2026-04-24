from sqlalchemy import Column, Integer, String, Float
from app.infrastructure.database import Base

# Esta es la tabla física que existirá en PostgreSQL
class ZonaRiesgoDB(Base):
    __tablename__ = "zonas_riesgo_v2" # <-- Cambia el nombre de la tabla a v2

    id = Column(Integer, primary_key=True, index=True)
    nombre_sector = Column(String, index=True)
    latitud = Column(Float)
    longitud = Column(Float)
    temperatura = Column(Float)
    humedad = Column(Float)
    ndvi = Column(Float)
    pendiente = Column(Float) # <-- NUEVO
    nivel_riesgo = Column(String)
