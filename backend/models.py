from datetime import datetime

from sqlalchemy import CheckConstraint, Column, DateTime, Float, Integer, String

from database import Base


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    __table_args__ = (
        CheckConstraint("probability >= 0 AND probability <= 100", name="ck_risk_assessments_probability_percent"),
        CheckConstraint("accuracy >= 0 AND accuracy <= 100", name="ck_risk_assessments_accuracy_percent"),
    )

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
    accuracy = Column(Float, nullable=False, default=0.0)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
