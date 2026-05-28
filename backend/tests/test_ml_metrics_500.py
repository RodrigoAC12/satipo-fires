from pathlib import Path
import sys

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from scripts.evaluate_massive_dataset import evaluate


def test_ml_metrics_with_500_massive_records():
    metrics = evaluate(write_reports=False)

    assert metrics["records"] == 500
    assert metrics["accuracy"] >= 0.70
    assert metrics["precision_weighted"] >= 0.70
    assert metrics["recall_weighted"] >= 0.70
    assert metrics["f1_weighted"] >= 0.70
    assert metrics["avg_inference_ms"] < 100
