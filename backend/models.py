from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from database import Base

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    wind = Column(Float, nullable=False)
    slope = Column(Float, nullable=False, default=0.0)
    ndvi = Column(Float, nullable=False, default=0.0)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    risk_level = Column(String, nullable=False)
    color = Column(String, nullable=False)
    probability = Column(Float, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)