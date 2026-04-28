from abc import ABC, abstractmethod

class MLServicePort(ABC):
    @abstractmethod
    def predict_risk(self, temp: float, hum: float, wind: float, slope: float, ndvi: float, lat: float, lon: float) -> dict:
        pass