import joblib
import os
import pandas as pd
import logging

logger = logging.getLogger(__name__)

# 1. Buscamos la ruta exacta donde se guardó nuestro archivo binario
# Intentamos múltiples ubicaciones posibles
DIRECTORIO_ACTUAL = os.path.dirname(os.path.abspath(__file__))
POSIBLES_RUTAS = [
    os.path.join(DIRECTORIO_ACTUAL, 'modelo_rf.joblib'),  # En infrastructure/
    os.path.join(os.path.dirname(DIRECTORIO_ACTUAL), 'modelo_rf.joblib'),  # En app/
    os.path.join(os.path.dirname(os.path.dirname(DIRECTORIO_ACTUAL)), 'modelo_rf.joblib'),  # En backend/
]

RUTA_MODELO = None
for ruta_posible in POSIBLES_RUTAS:
    if os.path.exists(ruta_posible):
        RUTA_MODELO = ruta_posible
        logger.info(f"Archivo del modelo encontrado en: {RUTA_MODELO}")
        break

if RUTA_MODELO is None:
    logger.warning(f"Archivo del modelo NO encontrado. Rutas verificadas: {POSIBLES_RUTAS}")

# 2. Cargamos el modelo a la memoria (se hace una sola vez al encender el servidor)
modelo_rf = None
if RUTA_MODELO is not None:
    try:
        modelo_rf = joblib.load(RUTA_MODELO)
        logger.info("Modelo Random Forest cargado exitosamente en la API.")
    except Exception as e:
        logger.error(f"Error al cargar el modelo: {e}")
        modelo_rf = None
else:
    logger.error("No se pudo localizar el archivo del modelo.")

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