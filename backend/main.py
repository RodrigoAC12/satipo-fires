import os
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import Depends, FastAPI, Header, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

import database
import models
import schemas
from application.use_cases import EvaluateRiskUseCase
from infrastructure.adapters.rf_adapter import RandomForestAdapter

DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://satipo-fires.vercel.app",
]


def should_auto_create_tables() -> bool:
    return os.getenv("AUTO_CREATE_TABLES", "true").strip().lower() not in {"0", "false", "no"}


def ensure_database_schema() -> None:
    if not should_auto_create_tables():
        return

    models.Base.metadata.create_all(bind=database.engine)
    with database.engine.begin() as connection:
        connection.execute(
            text(
                "ALTER TABLE risk_assessments "
                "ADD COLUMN IF NOT EXISTS accuracy DOUBLE PRECISION"
            )
        )
        connection.execute(
            text(
                "UPDATE risk_assessments "
                "SET accuracy = probability "
                "WHERE accuracy IS NULL AND probability IS NOT NULL"
            )
        )
        connection.execute(text("UPDATE risk_assessments SET accuracy = 0 WHERE accuracy IS NULL"))
        connection.execute(text("ALTER TABLE risk_assessments ALTER COLUMN accuracy SET DEFAULT 0"))
        connection.execute(text("ALTER TABLE risk_assessments ALTER COLUMN accuracy SET NOT NULL"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_database_schema()
    yield

ml_adapter = RandomForestAdapter()
evaluate_risk_use_case = EvaluateRiskUseCase(ml_adapter)

app = FastAPI(title="Risk Assessment API - Satipo (Hexagonal)", lifespan=lifespan)


def parse_allowed_origins() -> List[str]:
    origins = os.getenv("ALLOWED_ORIGINS", "")
    parsed_origins = [origin.strip() for origin in origins.split(",") if origin.strip()]
    return parsed_origins or DEFAULT_ALLOWED_ORIGINS


app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "Backend Satipo Operacional"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/predict", response_model=schemas.PredictionResponse)
def predict_risk(data: schemas.PredictionRequest, db: Session = Depends(database.get_db)):
    result = evaluate_risk_use_case.execute(
        data.temperature,
        data.humidity,
        data.wind,
        data.slope,
        data.ndvi,
        data.latitude,
        data.longitude,
    )

    new_assessment = models.RiskAssessment(
        temperature=data.temperature,
        humidity=data.humidity,
        wind=data.wind,
        slope=data.slope,
        ndvi=data.ndvi,
        latitude=data.latitude,
        longitude=data.longitude,
        risk_level=result["level"],
        color=result["color"],
        probability=result["probability"],
        accuracy=result["probability"],
    )
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)
    return new_assessment


@app.get("/history", response_model=List[schemas.PredictionResponse])
def get_history(limit: int = Query(50, ge=1, le=200), db: Session = Depends(database.get_db)):
    return db.query(models.RiskAssessment).order_by(models.RiskAssessment.created_at.desc()).limit(limit).all()


@app.delete("/history/clear")
def clear_history(
    db: Session = Depends(database.get_db),
    x_admin_key: Optional[str] = Header(default=None, alias="X-Admin-Key"),
):
    admin_key = os.getenv("ADMIN_KEY", "").strip()
    if not admin_key or admin_key == "change_me":
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ADMIN_KEY no esta configurada",
        )

    if x_admin_key != admin_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ADMIN_KEY invalida",
        )

    db.query(models.RiskAssessment).delete()
    db.commit()
    return {"message": "Historial eliminado exitosamente"}
