from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RiskAssessmentEntity(BaseModel):
    id: Optional[int] = None
    temperature: float
    humidity: float
    wind: float
    slope: float  # Pendiente
    ndvi: float   # Índice de vegetación
    latitude: float
    longitude: float
    risk_level: str
    color: str
    probability: float
    created_at: Optional[datetime] = None