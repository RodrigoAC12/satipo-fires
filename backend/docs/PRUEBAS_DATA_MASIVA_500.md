# Pruebas con data masiva y métricas - Satipo FireGuard AI

Esta evidencia valida el PMV con **500 registros sintéticos controlados** y métricas de Machine Learning/API.

## Regla conceptual CC-01

- `probability` o `confidence_percent`: confianza individual de una prediccion.
- `accuracy`: metrica global calculada comparando los 500 registros esperados vs. predichos.
- La prueba API reporta `confidence_percent` desde `probability`; no usa `accuracy` como confianza individual.

## Archivos agregados

| Archivo | Uso |
|---|---|
| `data/massive_test_dataset_500.csv` | Dataset de 500 registros para prueba masiva |
| `scripts/generate_massive_dataset.py` | Genera automáticamente el CSV de 500 registros |
| `scripts/evaluate_massive_dataset.py` | Calcula Accuracy, Precision, Recall, F1-Score y matriz de confusión |
| `scripts/api_massive_test_500.py` | Envía 500 peticiones al endpoint `POST /predict` |
| `tests/test_ml_metrics_500.py` | Prueba automática con Pytest para validar métricas mínimas |

## 1. Ejecutar métricas ML

Desde la carpeta `backend`:

```bash
python scripts/generate_massive_dataset.py
python scripts/evaluate_massive_dataset.py
```

Genera:

```text
reports/ml_metrics_500.json
reports/ml_predictions_500.csv
```

Métricas esperadas:

| Métrica | Objetivo mínimo |
|---|---:|
| Accuracy | >= 0.70 |
| Precision | >= 0.70 |
| Recall | >= 0.70 |
| F1-Score | >= 0.70 |
| Tiempo promedio de inferencia | < 100 ms |

## 2. Ejecutar prueba automática

Desde la carpeta `backend`:

```bash
pytest tests/test_ml_metrics_500.py -q
```

## 3. Ejecutar prueba masiva de API

Primero inicia el backend:

```bash
uvicorn main:app --reload --port 8000
```

En otra terminal, desde `backend`:

```bash
python scripts/api_massive_test_500.py
```

También puedes configurar valores:

```bash
API_BASE_URL=http://localhost:8000 LIMIT=500 CONCURRENCY=25 python scripts/api_massive_test_500.py
```

Genera:

```text
reports/api_massive_test_500.json
reports/api_massive_test_500.csv
```

## Texto sugerido para el informe

Se ejecutó una prueba con data masiva de 500 registros sintéticos controlados, considerando variables ambientales y geográficas: temperatura, humedad, viento, pendiente, NDVI, latitud y longitud. Cada registro incluyó una clase esperada de riesgo: Bajo, Medio, Alto o Crítico.

El modelo Random Forest fue evaluado comparando el riesgo esperado contra el riesgo predicho. Se calcularon métricas globales de desempeño: Accuracy, Precision, Recall y F1-Score. Además, se midió el tiempo promedio de inferencia para evaluar el rendimiento del componente de Machine Learning.

También se realizó una prueba masiva del endpoint `POST /predict` enviando 500 peticiones con concurrencia configurable, registrando porcentaje de éxito, tiempo promedio de respuesta, tiempo máximo, percentil 95 y requests por minuto.

> Nota: El dataset es sintético controlado. Para afirmar precisión real del sistema se requiere un dataset histórico etiquetado de incendios forestales y variables ambientales reales.
