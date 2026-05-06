import os
from typing import List, Optional

from fastapi import Depends, FastAPI, Header, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import database
import models
import schemas
from application.use_cases import EvaluateRiskUseCase
from infrastructure.adapters.rf_adapter import RandomForestAdapter

models.Base.metadata.create_all(bind=database.engine)

ml_adapter = RandomForestAdapter()
evaluate_risk_use_case = EvaluateRiskUseCase(ml_adapter)

app = FastAPI(title="Risk Assessment API - Satipo (Hexagonal)")


def parse_allowed_origins() -> List[str]:
    origins = os.getenv("ALLOWED_ORIGINS", "")
    parsed_origins = [origin.strip() for origin in origins.split(",") if origin.strip()]
    return parsed_origins or ["http://localhost:5173", "http://127.0.0.1:5173"]


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
    admin_key = os.getenv("ADMIN_KEY")
    if admin_key and x_admin_key != admin_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ADMIN_KEY invalida",
        )

    db.query(models.RiskAssessment).delete()
    db.commit()
    return {"message": "Historial eliminado exitosamente"}
