import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from domain.ports.ml_service import MLServicePort

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "rf_satipo_model.pkl")

class RandomForestAdapter(MLServicePort):
    def __init__(self):
        self.model = self._load_model()

    def _train_and_save(self):
        # Datos sintéticos basados en Satipo (Temp, Hum, Viento, Pendiente, NDVI, Lat, Lon)
        X = np.array([
            [15.0, 80.0, 5.0, 10.0, 0.8, -11.25, -74.63], # Bajo
            [25.0, 60.0, 10.0, 25.0, 0.5, -11.25, -74.63], # Medio
            [32.0, 30.0, 20.0, 45.0, 0.3, -11.25, -74.63], # Alto
            [40.0, 15.0, 35.0, 60.0, 0.1, -11.25, -74.63], # Crítico
        ] * 25)
        y = np.array([0, 1, 2, 3] * 25)
        
        model = RandomForestClassifier(n_estimators=20, random_state=42)
        model.fit(X, y)
        joblib.dump(model, MODEL_PATH)
        return model

    def _load_model(self):
        if not os.path.exists(MODEL_PATH):
            return self._train_and_save()
        return joblib.load(MODEL_PATH)

    def predict_risk(self, temp: float, hum: float, wind: float, slope: float, ndvi: float, lat: float, lon: float) -> dict:
        features = np.array([[temp, hum, wind, slope, ndvi, lat, lon]])
        prediction = int(self.model.predict(features)[0])
        probabilities = self.model.predict_proba(features)[0]
        max_prob = float(round(probabilities[prediction] * 100, 2))
        
        # Categorías exigidas por el documento para Satipo
        mapping = {
            0: {"level": "Bajo", "color": "#28a745"},
            1: {"level": "Medio", "color": "#ffc107"},
            2: {"level": "Alto", "color": "#fd7e14"},
            3: {"level": "Crítico", "color": "#dc3545"} 
        }
        res = mapping[prediction]
        res["probability"] = max_prob
        return res