"""Evaluate Satipo FireGuard AI with a 500-record massive dataset.

Usage from the backend folder:
    python scripts/evaluate_massive_dataset.py

It generates:
    reports/ml_metrics_500.json
    reports/ml_predictions_500.csv
"""

from __future__ import annotations

import csv
import json
import sys
import time
from pathlib import Path
from typing import Any

from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from infrastructure.adapters.rf_adapter import RandomForestAdapter  # noqa: E402

DATASET_PATH = BACKEND_DIR / "data" / "massive_test_dataset_500.csv"
REPORTS_DIR = BACKEND_DIR / "reports"
LABELS = ["Bajo", "Medio", "Alto", "Crítico"]
FEATURE_COLUMNS = ["temperature", "humidity", "wind", "slope", "ndvi", "latitude", "longitude"]


def _to_float(row: dict[str, str], column: str) -> float:
    try:
        return float(row[column])
    except (KeyError, TypeError, ValueError) as exc:
        raise ValueError(f"Valor invalido en columna '{column}': {row.get(column)!r}") from exc


def load_dataset(dataset_path: Path = DATASET_PATH) -> list[dict[str, Any]]:
    """Load the 500-record CSV dataset. If it does not exist, generate it first."""
    if not dataset_path.exists():
        from scripts.generate_massive_dataset import generate_dataset

        generate_dataset(dataset_path)

    with dataset_path.open(encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        rows: list[dict[str, Any]] = []
        for index, row in enumerate(reader, start=1):
            clean_row = {column: _to_float(row, column) for column in FEATURE_COLUMNS}
            expected_risk = (row.get("expected_risk") or "").strip()
            if expected_risk not in LABELS:
                raise ValueError(f"Fila {index}: expected_risk invalido: {expected_risk!r}")
            clean_row["expected_risk"] = expected_risk
            rows.append(clean_row)
    return rows


def evaluate(dataset_path: Path = DATASET_PATH, write_reports: bool = True) -> dict[str, Any]:
    """Run the Random Forest model over the dataset and return ML metrics."""
    dataset = load_dataset(dataset_path)
    model = RandomForestAdapter()

    y_true: list[str] = []
    y_pred: list[str] = []
    prediction_rows: list[dict[str, Any]] = []
    inference_times_ms: list[float] = []

    for row in dataset:
        started = time.perf_counter()
        result = model.predict_risk(
            row["temperature"],
            row["humidity"],
            row["wind"],
            row["slope"],
            row["ndvi"],
            row["latitude"],
            row["longitude"],
        )
        inference_times_ms.append((time.perf_counter() - started) * 1000)

        predicted_risk = result["level"]
        y_true.append(row["expected_risk"])
        y_pred.append(predicted_risk)

        prediction_rows.append(
            {
                **row,
                "predicted_risk": predicted_risk,
                "confidence_percent": result["probability"],
                "is_correct": row["expected_risk"] == predicted_risk,
            }
        )

    matrix = confusion_matrix(y_true, y_pred, labels=LABELS)
    metrics: dict[str, Any] = {
        "dataset": str(dataset_path.relative_to(BACKEND_DIR)),
        "dataset_type": "synthetic_controlled_500_records",
        "records": len(dataset),
        "labels": LABELS,
        "accuracy": round(accuracy_score(y_true, y_pred), 4),
        "precision_weighted": round(precision_score(y_true, y_pred, average="weighted", zero_division=0), 4),
        "recall_weighted": round(recall_score(y_true, y_pred, average="weighted", zero_division=0), 4),
        "f1_weighted": round(f1_score(y_true, y_pred, average="weighted", zero_division=0), 4),
        "precision_macro": round(precision_score(y_true, y_pred, average="macro", zero_division=0), 4),
        "recall_macro": round(recall_score(y_true, y_pred, average="macro", zero_division=0), 4),
        "f1_macro": round(f1_score(y_true, y_pred, average="macro", zero_division=0), 4),
        "avg_inference_ms": round(sum(inference_times_ms) / len(inference_times_ms), 4),
        "max_inference_ms": round(max(inference_times_ms), 4),
        "confusion_matrix": {
            label: {pred_label: int(matrix[row_index][col_index]) for col_index, pred_label in enumerate(LABELS)}
            for row_index, label in enumerate(LABELS)
        },
        "note": (
            "Estas metricas validan el comportamiento del modelo con data masiva sintetica controlada. "
            "Para afirmar precision real del sistema se requiere un dataset historico etiquetado."
        ),
    }

    if write_reports:
        REPORTS_DIR.mkdir(exist_ok=True)

        metrics_path = REPORTS_DIR / "ml_metrics_500.json"
        with metrics_path.open("w", encoding="utf-8") as file:
            json.dump(metrics, file, ensure_ascii=False, indent=2)

        predictions_path = REPORTS_DIR / "ml_predictions_500.csv"
        with predictions_path.open("w", encoding="utf-8", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=list(prediction_rows[0].keys()))
            writer.writeheader()
            writer.writerows(prediction_rows)

    return metrics


if __name__ == "__main__":
    result = evaluate()
    print(json.dumps(result, ensure_ascii=False, indent=2))
