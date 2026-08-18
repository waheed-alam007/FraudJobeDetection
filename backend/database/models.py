from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class FraudIncident(Base):
    __tablename__ = "fraud_incidents"

    id = Column(Integer, primary_key=True, index=True)
    target_url = Column(String, nullable=True)
    risk_score = Column(Float, nullable=False)
    red_flags = Column(Text, nullable=False) # Store as JSON or comma-separated
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    company_name = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
