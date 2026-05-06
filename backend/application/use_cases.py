from domain.ports.ml_service import MLServicePort


class EvaluateRiskUseCase:
    def __init__(self, ml_service: MLServicePort):
        self.ml_service = ml_service

    def execute(self, temp: float, hum: float, wind: float, slope: float, ndvi: float, lat: float, lon: float) -> dict:
        return self.ml_service.predict_risk(temp, hum, wind, slope, ndvi, lat, lon)
