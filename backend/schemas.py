from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PredictionRequest(BaseModel):
    temperature: float
    humidity: float
    wind: float
    slope: float
    ndvi: float
    latitude: float
    longitude: float

class PredictionResponse(BaseModel):
    id: int
    temperature: float
    humidity: float
    wind: float
    slope: float      # <--- CRÍTICO: Debe estar aquí
    ndvi: float       # <--- CRÍTICO: Debe estar aquí
    latitude: float
    longitude: float
    risk_level: str
    color: str
    probability: float
    created_at: datetime

    class Config:
        from_attributes = True