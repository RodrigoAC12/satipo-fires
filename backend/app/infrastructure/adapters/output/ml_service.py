import joblib
import os
import pandas as pd

# 1. Buscamos la ruta exacta donde se guardó nuestro archivo binario
DIRECTORIO_ACTUAL = os.path.dirname(os.path.abspath(__file__))
RUTA_MODELO = os.path.join(DIRECTORIO_ACTUAL, 'modelo_rf.joblib')

# 2. Cargamos el modelo a la memoria (se hace una sola vez al encender el servidor)
try:
    modelo_rf = joblib.load(RUTA_MODELO)
    print("Modelo Random Forest cargado exitosamente en la API.")
except Exception as e:
    print(f"Error al cargar el modelo: {e}")
    modelo_rf = None

# 3. La función que usará el caso de uso
def predecir_riesgo_incendio(temperatura: float, humedad: float, ndvi: float, pendiente: float) -> str: # <-- Añadir pendiente
    if modelo_rf is None:
        return "Error: Modelo no disponible"
    
    # scikit-learn ahora requiere las 4 columnas exactas con las que entrenó
    datos_entrada = pd.DataFrame([{
        'temperatura': temperatura,
        'humedad': humedad,
        'ndvi': ndvi,
        'pendiente': pendiente # <-- Añadir pendiente
    }])
    
    prediccion = modelo_rf.predict(datos_entrada)[0]
    return prediccion
