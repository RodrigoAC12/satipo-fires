import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# 1. Dataset actualizado con 'pendiente' y nivel 'Crítico'
datos_historicos = {
    'temperatura': [35.0, 22.0, 28.0, 38.0, 20.0, 42.0, 25.0, 36.0, 18.0, 33.0],
    'humedad':     [20.0, 80.0, 50.0, 15.0, 85.0, 10.0, 60.0, 25.0, 90.0, 35.0],
    'ndvi':        [0.20, 0.75, 0.50, 0.10, 0.80, 0.05, 0.65, 0.25, 0.85, 0.40],
    'pendiente':   [15.0, 5.0, 10.0, 25.0, 2.0, 35.0, 8.0, 20.0, 3.0, 12.0], # Grados de inclinación
    'riesgo':      ['Alto', 'Bajo', 'Medio', 'Alto', 'Bajo', 'Crítico', 'Medio', 'Alto', 'Bajo', 'Medio']
}

df = pd.DataFrame(datos_historicos)
X = df[['temperatura', 'humedad', 'ndvi', 'pendiente']] 
y = df['riesgo']

modelo_rf = RandomForestClassifier(n_estimators=100, random_state=42)
modelo_rf.fit(X, y)

ruta_destino = os.path.join('backend', 'app', 'infrastructure', 'modelo_rf.joblib')
joblib.dump(modelo_rf, ruta_destino)
print("¡IA Actualizada con éxito (Pendiente + Nivel Crítico)!")