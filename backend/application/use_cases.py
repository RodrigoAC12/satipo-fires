from domain.entities import RiskAssessmentEntity
from domain.ports.ml_service import MLServicePort

class EvaluateRiskUseCase:
    def __init__(self, ml_service: MLServicePort):
        self.ml_service = ml_service
        
    def execute(self, temp: float, hum: float, wind: float, slope: float, ndvi: float, lat: float, lon: float) -> dict:
        # Aquí reside la regla de negocio
        ml_result = self.ml_service.predict_risk(temp, hum, wind, slope, ndvi, lat, lon)
        
        # Extraemos la probabilidad del resultado del ML para usarla como precisión
        # Asumiendo que ml_result trae una llave 'probability' o similar
        probabilidad = ml_result.get('probability', 0)
        
        # Enriquecemos la respuesta con el campo de precisión formateado
        ml_result['accuracy'] = round(probabilidad * 100, 2)
        
        return ml_result