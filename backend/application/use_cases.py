from domain.entities import RiskAssessmentEntity
from domain.ports.ml_service import MLServicePort
# Nota: En una arquitectura hexagonal estricta, la BD también tendría un puerto aquí. 
# Para mantener la compatibilidad con SQLAlchemy + FastAPI Depends, lo gestionaremos en el endpoint.

class EvaluateRiskUseCase:
    def __init__(self, ml_service: MLServicePort):
        self.ml_service = ml_service
        
    def execute(self, temp: float, hum: float, wind: float, slope: float, ndvi: float, lat: float, lon: float) -> dict:
        # Aquí reside la regla de negocio
        ml_result = self.ml_service.predict_risk(temp, hum, wind, slope, ndvi, lat, lon)
        return ml_result