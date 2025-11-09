from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, func, Float, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid


class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    call_id = Column(UUID(as_uuid=True), ForeignKey("calls.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)

    # Trigger information
    trigger_type = Column(String(50))  # 'cost_concern', 'injection_anxiety', 'side_effect_fear', 'insurance_denial'
    trigger_confidence = Column(Float)  # 0.0-1.0
    trigger_text = Column(String(500))  # The actual text that triggered the detection
    trigger_timestamp = Column(DateTime(timezone=True))

    # Intervention information
    intervention_type = Column(String(50))  # 'copay_enrollment', 'nurse_callback', 'educational_material', 'supervisor_escalation'
    intervention_applied = Column(Boolean, default=False)
    intervention_timestamp = Column(DateTime(timezone=True))
    intervention_notes = Column(String(500))

    # Outcome tracking
    outcome_status = Column(String(50))  # 'patient_retained', 'patient_abandoned', 'pending', 'unknown'
    adherence_30_day = Column(Boolean)
    adherence_90_day = Column(Boolean)
    follow_up_date = Column(DateTime(timezone=True))

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AdherenceEvent(Base):
    __tablename__ = "adherence_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)

    event_type = Column(String(50))  # 'prescription_fill', 'injection_administered', 'lab_result', 'patient_report', 'missed_dose'
    event_date = Column(DateTime(timezone=True), nullable=False)
    event_data = Column(JSONB)  # Additional data specific to event type

    # Medication information
    medication_name = Column(String(200))
    days_supply = Column(Integer)

    # Outcome
    adherent = Column(Boolean)  # Was this an adherent event?
    notes = Column(String(500))

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MarketingCampaign(Base):
    __tablename__ = "marketing_campaigns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_name = Column(String(200), nullable=False)
    campaign_type = Column(String(50))  # 'education', 'outreach', 'awareness', 'retention'

    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True))

    # Targeting
    target_segment = Column(JSONB)  # {"states": ["CA", "NY"], "barriers": ["injection_anxiety"], "risk_level": "high"}
    message_theme = Column(String(200))  # 'injection_support', 'cost_assistance', 'side_effect_management'

    # Materials
    materials_shared = Column(JSONB)  # List of educational materials, videos, etc.

    # Performance
    patients_reached = Column(Integer, default=0)
    engagement_rate = Column(Float)  # Percentage
    conversion_rate = Column(Float)  # Percentage who took action

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
