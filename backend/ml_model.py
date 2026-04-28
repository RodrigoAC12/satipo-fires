import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier

MODEL_PATH = os.path.join(os.path.dirname(__file__), "risk_model.pkl")

def train_and_save_model():
    # Generamos datos sintéticos controlados para el MVP
    # [Temp, Humedad, Viento, Lat, Lon]
    # Clases: 0 (Bajo), 1 (Medio), 2 (Alto), 3 (Muy Alto)
    X = np.array([
        [15.0, 80.0, 5.0, -12.0, -77.0],
        [22.0, 60.0, 10.0, -12.0, -77.0],
        [32.0, 30.0, 25.0, -12.0, -77.0],
        [42.0, 15.0, 45.0, -12.0, -77.0],
    ] * 25) 
    
    y = np.array([0, 1, 2, 3] * 25)

    model = RandomForestClassifier(n_estimators=20, random_state=42)
    model.fit(X, y)
    joblib.dump(model, MODEL_PATH)
    print(f"Modelo entrenado exitosamente en: {MODEL_PATH}")

def load_model():
    if not os.path.exists(MODEL_PATH):
        train_and_save_model()
    return joblib.load(MODEL_PATH)

def evaluate_risk(model, temp, hum, wind, lat, lon):
    features = np.array([[temp, hum, wind, lat, lon]])
    
    # CORRECCIÓN: Convertir explícitamente a tipos nativos de Python
    prediction = int(model.predict(features)[0])
    probabilities = model.predict_proba(features)[0]
    max_prob = float(round(probabilities[prediction] * 100, 2))
    
    risk_mapping = {
        0: {"level": "Bajo", "color": "#28a745"},
        1: {"level": "Medio", "color": "#ffc107"},
        2: {"level": "Alto", "color": "#fd7e14"},
        3: {"level": "Muy Alto", "color": "#dc3545"}
    }
    
    result = risk_mapping[prediction]
    result["probability"] = max_prob
    return result