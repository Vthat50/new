from sqlalchemy import Column, String, DateTime, Numeric, Date, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.core.database import Base
import uuid


class AssistanceProgram(Base):
    __tablename__ = "assistance_programs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_name = Column(String(200), nullable=False)
    program_type = Column(String(50))  # copay, bridge, pap, foundation
    manufacturer = Column(String(100))
    drug_ndc = Column(String(11))
    drug_name = Column(String(200))
    income_threshold_fpl = Column(Numeric(5, 2))  # e.g., 4.0 for 400% FPL
    max_benefit_amount = Column(Numeric(10, 2))
    eligibility_criteria = Column(JSONB)
    application_url = Column(String(500))
    phone_number = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    program_id = Column(UUID(as_uuid=True), ForeignKey("assistance_programs.id"), nullable=False)
    call_id = Column(UUID(as_uuid=True), ForeignKey("calls.id"))
    enrollment_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), default="pending")  # pending, approved, denied, active
    estimated_savings = Column(Numeric(10, 2))
    renewal_date = Column(Date)
    notes = Column(String(500))
