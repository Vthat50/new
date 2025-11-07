from sqlalchemy import Column, String, Integer, Date, DateTime, func, Float
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import uuid


class Patient(Base):
    __tablename__ = "patients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mrn = Column(String(50), unique=True, nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date)
    phone = Column(String(20))
    email = Column(String(255))
    zip_code = Column(String(10), index=True)
    state = Column(String(2))
    insurance_type = Column(String(50))  # Medicare, Medicaid, Commercial, Uninsured
    insurance_plan_id = Column(String(100))
    insurance_plan_name = Column(String(200))
    sdoh_risk_score = Column(Integer, default=0)  # 0-100
    status = Column(String(50), default="active")  # active, pending, inactive
    journey_stage = Column(String(50))  # new_start, pa_pending, active_treatment, at_risk, churned
    adherence_score = Column(Integer, default=75)  # 0-100, medication adherence
    last_contact_date = Column(DateTime(timezone=True))  # Last interaction date
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
