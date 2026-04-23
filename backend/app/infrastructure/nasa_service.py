import requests
import csv
from io import StringIO

def obtener_puntos_calor_nasa():
    # Coordenadas exactas de Satipo (Bounding Box)
    bbox = "-75.5,-12.5,-73.5,-10.5"
    url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/c06497334709f109282305886369f697/VIIRS_SNPP_NRT/{bbox}/1"
    
    puntos = []
    try:
        # Intentamos obtener datos reales con un tiempo de espera corto
        response = requests.get(url, timeout=3)
        if response.status_code == 200 and "latitude" in response.text:
            f = StringIO(response.text)
            reader = csv.DictReader(f)
            for row in reader:
                puntos.append({
                    "lat": float(row['latitude']),
                    "lon": float(row['longitude']),
                    "confianza": row.get('confidence', 'N/A'),
                    "satelite": "VIIRS (NASA Real)"
                })
    except Exception:
        print("NASA Offline - Usando modo demostración")

    # SIEMPRE agregamos al menos 3 puntos de prueba para asegurar que el mapa no se vea vacío
    # Estos puntos están colocados estratégicamente cerca del centro de Satipo
    puntos_demo = [
        {"lat": -11.2800, "lon": -74.6000, "confianza": "Alta", "satelite": "DEMO-SAT 1"},
        {"lat": -11.1500, "lon": -74.7000, "confianza": "Media", "satelite": "DEMO-SAT 2"},
        {"lat": -11.3500, "lon": -74.5000, "confianza": "Crítica", "satelite": "DEMO-SAT 3"}
    ]
    
    # Combinamos reales (si hay) con los de demo para la presentación
    return puntos + puntos_demo