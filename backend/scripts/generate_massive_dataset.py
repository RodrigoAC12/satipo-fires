"""Generate a controlled 500-record dataset for massive ML/API tests.

Usage from the backend folder:
    python scripts/generate_massive_dataset.py

Output:
    data/massive_test_dataset_500.csv
"""

from __future__ import annotations

import csv
import random
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
DATASET_PATH = BACKEND_DIR / "data" / "massive_test_dataset_500.csv"
FIELDNAMES = ["temperature", "humidity", "wind", "slope", "ndvi", "latitude", "longitude", "expected_risk"]

# Controlled synthetic ranges aligned with the four classes used by the current Random Forest adapter.
CLASS_RANGES = [
    ("Bajo", (12, 20), (72, 92), (1, 9), (2, 18), (0.68, 0.92)),
    ("Medio", (21, 29), (50, 68), (6, 14), (18, 32), (0.42, 0.62)),
    ("Alto", (30, 35), (25, 42), (15, 25), (35, 52), (0.22, 0.42)),
    ("Crítico", (37, 44), (8, 24), (28, 42), (52, 72), (-0.05, 0.20)),
]


def _random_between(value_range: tuple[float, float], decimals: int = 1) -> float:
    return round(random.uniform(*value_range), decimals)


def generate_dataset(output_path: Path = DATASET_PATH, records_per_class: int = 125, seed: int = 42) -> Path:
    """Generate 500 balanced records: 125 Bajo, 125 Medio, 125 Alto and 125 Crítico."""
    random.seed(seed)
    rows: list[dict[str, float | str]] = []

    for label, temp_range, humidity_range, wind_range, slope_range, ndvi_range in CLASS_RANGES:
        for _ in range(records_per_class):
            rows.append(
                {
                    "temperature": _random_between(temp_range),
                    "humidity": _random_between(humidity_range),
                    "wind": _random_between(wind_range),
                    "slope": _random_between(slope_range),
                    "ndvi": _random_between(ndvi_range, 2),
                    "latitude": round(-11.25 + random.uniform(-0.12, 0.12), 6),
                    "longitude": round(-74.63 + random.uniform(-0.18, 0.18), 6),
                    "expected_risk": label,
                }
            )

    random.shuffle(rows)
    output_path.parent.mkdir(exist_ok=True)

    with output_path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)

    return output_path


if __name__ == "__main__":
    path = generate_dataset()
    print(f"Dataset generado: {path}")
    print("Total registros: 500")
