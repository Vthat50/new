from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, ARRAY, func, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid


class Call(Base):
    __tablename__ = "calls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    audio_file_url = Column(String(500))
    transcript = Column(Text)
    duration_seconds = Column(Integer)
    call_date = Column(DateTime(timezone=True), server_default=func.now())
    call_direction = Column(String(20), default="inbound")  # inbound or outbound
    sentiment_score = Column(Float, default=0.7)  # 0.0 to 1.0, sentiment analysis
    friction_topics = Column(ARRAY(String))  # ['PA Delays', 'High Costs', 'Pharmacy Issues']
    outcome = Column(String(50), default="resolved")  # resolved, escalated, callback_scheduled, no_answer
    barriers_identified = Column(ARRAY(String))  # ['transportation', 'cost', 'health_literacy']
    programs_enrolled = Column(ARRAY(String))  # ['copay_assistance', 'bridge', 'pap']
    actions_taken = Column(JSONB)  # {action: 'enroll_home_delivery', status: 'completed'}
    ai_recommendations = Column(JSONB)  # Full AI recommendation object
    call_summary = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    # patient = relationship("Patient", back_populates="calls")
