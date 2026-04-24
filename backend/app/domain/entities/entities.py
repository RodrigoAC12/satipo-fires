from pydantic import BaseModel
from typing import Optional

# Esta es la regla de negocio pura. Así entendemos una Zona de Riesgo.
class ZonaRiesgo(BaseModel):
    nombre_sector: str
    latitud: float
    longitud: float
    temperatura: float
    humedad: float
    ndvi: float  # Índice de vegetación
    pendiente: float
    nivel_riesgo: Optional[str] = "No evaluado"

    class Config:
        orm_mode = True
