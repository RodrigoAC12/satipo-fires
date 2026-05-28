"""Run a 500-request massive API test against POST /predict.

Usage from the backend folder:
    API_BASE_URL=http://localhost:8000 python scripts/api_massive_test_500.py

Optional environment variables:
    LIMIT=500
    CONCURRENCY=25

It generates:
    reports/api_massive_test_500.json
    reports/api_massive_test_500.csv
"""

from __future__ import annotations

import csv
import json
import os
import statistics
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any

BACKEND_DIR = Path(__file__).resolve().parents[1]
DATASET_PATH = BACKEND_DIR / "data" / "massive_test_dataset_500.csv"
REPORTS_DIR = BACKEND_DIR / "reports"
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000").rstrip("/")
LIMIT = int(os.getenv("LIMIT", "500"))
CONCURRENCY = int(os.getenv("CONCURRENCY", "25"))
FEATURE_COLUMNS = ["temperature", "humidity", "wind", "slope", "ndvi", "latitude", "longitude"]


def load_payloads() -> list[dict[str, float]]:
    if not DATASET_PATH.exists():
        from generate_massive_dataset import generate_dataset

        generate_dataset(DATASET_PATH)

    with DATASET_PATH.open(encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        payloads = []
        for row in reader:
            payloads.append({column: float(row[column]) for column in FEATURE_COLUMNS})
    return payloads[:LIMIT]


def post_predict(payload: dict[str, float], index: int) -> dict[str, Any]:
    started = time.perf_counter()
    request = urllib.request.Request(
        f"{API_BASE_URL}/predict",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            body = response.read().decode("utf-8")
            elapsed_ms = (time.perf_counter() - started) * 1000
            data = json.loads(body)
            return {
                "index": index,
                "status": response.status,
                "ok": 200 <= response.status < 300,
                "elapsed_ms": round(elapsed_ms, 4),
                "error": "",
                "prediction_id": data.get("id", ""),
                "risk_level": data.get("risk_level", ""),
                "confidence_percent": data.get("probability", ""),
            }
    except urllib.error.HTTPError as exc:
        elapsed_ms = (time.perf_counter() - started) * 1000
        return {
            "index": index,
            "status": exc.code,
            "ok": False,
            "elapsed_ms": round(elapsed_ms, 4),
            "error": exc.read().decode("utf-8", errors="replace")[:300],
            "prediction_id": "",
            "risk_level": "",
            "confidence_percent": "",
        }
    except Exception as exc:
        elapsed_ms = (time.perf_counter() - started) * 1000
        return {
            "index": index,
            "status": 0,
            "ok": False,
            "elapsed_ms": round(elapsed_ms, 4),
            "error": str(exc),
            "prediction_id": "",
            "risk_level": "",
            "confidence_percent": "",
        }


def run_api_test() -> dict[str, Any]:
    payloads = load_payloads()
    started = time.perf_counter()
    results = []

    with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        futures = [executor.submit(post_predict, payload, index) for index, payload in enumerate(payloads, start=1)]
        for future in as_completed(futures):
            results.append(future.result())

    total_elapsed_seconds = time.perf_counter() - started
    elapsed_values = [item["elapsed_ms"] for item in results]
    success_count = sum(1 for item in results if item["ok"])
    failure_count = len(results) - success_count

    summary: dict[str, Any] = {
        "api_base_url": API_BASE_URL,
        "endpoint": "/predict",
        "total_requests": len(results),
        "concurrency": CONCURRENCY,
        "success_count": success_count,
        "failure_count": failure_count,
        "success_rate_percent": round((success_count / len(results)) * 100, 2) if results else 0,
        "total_elapsed_seconds": round(total_elapsed_seconds, 4),
        "requests_per_minute": round((len(results) / total_elapsed_seconds) * 60, 2) if total_elapsed_seconds else 0,
        "avg_response_ms": round(statistics.mean(elapsed_values), 4) if elapsed_values else 0,
        "min_response_ms": round(min(elapsed_values), 4) if elapsed_values else 0,
        "max_response_ms": round(max(elapsed_values), 4) if elapsed_values else 0,
        "p95_response_ms": round(statistics.quantiles(elapsed_values, n=20)[18], 4) if len(elapsed_values) >= 20 else 0,
        "objective": "500 peticiones con 25 usuarios concurrentes para validar rendimiento basico de la API.",
        "cc_01_rule": (
            "confidence_percent/probability representa la confianza individual de una prediccion; "
            "accuracy se reserva para la metrica global calculada con los 500 registros."
        ),
    }

    REPORTS_DIR.mkdir(exist_ok=True)

    with (REPORTS_DIR / "api_massive_test_500.json").open("w", encoding="utf-8") as file:
        json.dump({"summary": summary, "results": sorted(results, key=lambda item: item["index"])}, file, ensure_ascii=False, indent=2)

    with (REPORTS_DIR / "api_massive_test_500.csv").open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=[
                "index",
                "status",
                "ok",
                "elapsed_ms",
                "error",
                "prediction_id",
                "risk_level",
                "confidence_percent",
            ],
        )
        writer.writeheader()
        writer.writerows(sorted(results, key=lambda item: item["index"]))

    return summary


if __name__ == "__main__":
    print(json.dumps(run_api_test(), ensure_ascii=False, indent=2))
