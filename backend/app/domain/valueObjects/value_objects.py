# Value Objects del dominio
# En esta capa puedes definir objetos de valor que representan conceptos del negocio
# Por ejemplo: Coordenadas, Temperatura, Nivel de Riesgo, etc.

from pydantic import BaseModel

class Coordenadas(BaseModel):
    """Valor de dominio que representa una ubicación geográfica"""
    latitud: float
    longitud: float

class NivelRiesgo(BaseModel):
    """Valor de dominio que representa el nivel de riesgo calculado"""
    nivel: str  # "Bajo", "Medio", "Alto"
    confianza: float  # 0-100

class ParametrosAmbientales(BaseModel):
    """Valor de dominio que agrupa parámetros ambientales"""
    temperatura: float
    humedad: float
    ndvi: float
    pendiente: float
