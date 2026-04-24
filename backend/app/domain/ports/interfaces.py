# Puertos (Interfaces) del Dominio
# Definen los contratos que deben cumplir los adaptadores externos

from abc import ABC, abstractmethod
from typing import List
from app.domain.entities.entities import ZonaRiesgo

class RepositorioZonas(ABC):
    """Interfaz para el repositorio de Zonas de Riesgo"""
    
    @abstractmethod
    def guardar(self, zona: ZonaRiesgo) -> ZonaRiesgo:
        """Guarda una nueva zona de riesgo"""
        pass
    
    @abstractmethod
    def obtener_todas(self) -> List[ZonaRiesgo]:
        """Obtiene todas las zonas de riesgo registradas"""
        pass
    
    @abstractmethod
    def obtener_por_id(self, zona_id: int) -> ZonaRiesgo:
        """Obtiene una zona específica por ID"""
        pass

class ServicioPrediccion(ABC):
    """Interfaz para el servicio de predicción IA"""
    
    @abstractmethod
    def predecir(self, temperatura: float, humedad: float, ndvi: float, pendiente: float) -> str:
        """Realiza una predicción de riesgo"""
        pass

class ServicioClimaticoExterno(ABC):
    """Interfaz para consumir servicios climáticos externos"""
    
    @abstractmethod
    def obtener_puntos_calor(self) -> List[dict]:
        """Obtiene puntos de calor desde fuente externa"""
        pass
