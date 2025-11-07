from sqlalchemy import Column, String, Integer, Date, DateTime, Numeric, Boolean, func, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.core.database import Base
import uuid


class Formulary(Base):
    __tablename__ = "formularies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plan_id = Column(String(100), nullable=False, index=True)
    plan_name = Column(String(200))
    plan_type = Column(String(50))  # Medicare Advantage, Medicaid, Commercial
    state = Column(String(2), index=True)
    drug_ndc = Column(String(11))
    drug_name = Column(String(200), index=True)
    tier = Column(Integer)  # 1, 2, 3, 4, 5
    pa_required = Column(Boolean, default=False)
    quantity_limits = Column(String(100))
    step_therapy = Column(Boolean, default=False)
    estimated_copay = Column(Numeric(10, 2))
    formulary_data = Column(JSONB)  # Additional metadata
    effective_date = Column(Date)
    last_updated = Column(DateTime(timezone=True), server_default=func.now())

    # Composite indexes for common queries
    __table_args__ = (
        Index('idx_plan_drug', 'plan_id', 'drug_ndc'),
        Index('idx_drug_state', 'drug_name', 'state'),
    )
