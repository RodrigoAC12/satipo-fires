from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PredictionRequest(BaseModel):
    temperature: float = Field(..., ge=0, le=60)
    humidity: float = Field(..., ge=0, le=100)
    wind: float = Field(..., ge=0, le=150)
    slope: float = Field(..., ge=0, le=90)
    ndvi: float = Field(..., ge=-1, le=1)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class PredictionResponse(BaseModel):
    id: int
    temperature: float
    humidity: float
    wind: float
    slope: float
    ndvi: float
    latitude: float
    longitude: float
    risk_level: str
    color: str
    probability: float = Field(..., ge=0, le=100)
    accuracy: float = Field(..., ge=0, le=100)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
