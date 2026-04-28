import os
import io
import csv
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse

# Importaciones de la infraestructura vieja (BD)
import database, models, schemas

# Importaciones Hexagonales (Nuevas)
from infrastructure.adapters.rf_adapter import RandomForestAdapter
from application.use_cases import EvaluateRiskUseCase

# Crear tablas en la BD
models.Base.metadata.create_all(bind=database.engine)

# Inyección de dependencias (Hexagonal)
ml_adapter = RandomForestAdapter()
evaluate_risk_use_case = EvaluateRiskUseCase(ml_adapter)

app = FastAPI(title="Risk Assessment API - Satipo (Hexagonal)")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check
@app.get("/")
def read_root():
    return {"status": "Backend Satipo Operacional"}

# ==========================================
# 🚀 ENDPOINTS DE LA API
# ==========================================

@app.post("/predict", response_model=schemas.PredictionResponse)
def predict_risk(data: schemas.PredictionRequest, db: Session = Depends(database.get_db)):
    # 1. Ejecutar Caso de Uso (Desacoplado)
    result = evaluate_risk_use_case.execute(
        data.temperature, data.humidity, data.wind, data.slope, data.ndvi, data.latitude, data.longitude
    )
    
    # 2. Persistencia
    new_assessment = models.RiskAssessment(
        temperature=data.temperature, humidity=data.humidity, wind=data.wind,
        slope=data.slope, ndvi=data.ndvi, latitude=data.latitude, longitude=data.longitude,
        risk_level=result["level"], color=result["color"], probability=result["probability"]
    )
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)
    return new_assessment

@app.get("/history", response_model=list[schemas.PredictionResponse])
def get_history(limit: int = 50, db: Session = Depends(database.get_db)):
    return db.query(models.RiskAssessment).order_by(models.RiskAssessment.created_at.desc()).limit(limit).all()

@app.delete("/history/clear")
def clear_history(db: Session = Depends(database.get_db)):
    db.query(models.RiskAssessment).delete()
    db.commit()
    return {"message": "Historial eliminado exitosamente"}