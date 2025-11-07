from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class CallBase(BaseModel):
    patient_id: UUID
    audio_file_url: Optional[str] = None
    transcript: Optional[str] = None
    duration_seconds: Optional[int] = None
    call_direction: Optional[str] = "inbound"
    sentiment_score: Optional[float] = 0.7
    friction_topics: Optional[List[str]] = []
    outcome: Optional[str] = "resolved"
    barriers_identified: Optional[List[str]] = []
    programs_enrolled: Optional[List[str]] = []
    actions_taken: Optional[dict] = None
    ai_recommendations: Optional[dict] = None
    call_summary: Optional[str] = None


class CallCreate(CallBase):
    pass


class Call(CallBase):
    id: UUID
    call_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class CallAnalysis(BaseModel):
    """Response from AI analysis of a call"""
    transcript: str
    patient_data: dict
    enrichment_data: dict
    barriers: List[str]
    recommendations: List[dict]
    call_summary: str
