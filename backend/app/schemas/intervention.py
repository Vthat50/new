from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional


class InterventionBase(BaseModel):
    trigger_type: Optional[str] = None
    trigger_confidence: Optional[float] = None
    trigger_text: Optional[str] = None
    intervention_type: Optional[str] = None
    intervention_applied: bool = False
    intervention_notes: Optional[str] = None
    outcome_status: Optional[str] = "pending"


class InterventionCreate(InterventionBase):
    call_id: UUID
    patient_id: UUID


class InterventionResponse(InterventionBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    call_id: UUID
    patient_id: UUID
    trigger_timestamp: Optional[datetime] = None
    intervention_timestamp: Optional[datetime] = None
    adherence_30_day: Optional[bool] = None
    adherence_90_day: Optional[bool] = None
    follow_up_date: Optional[datetime] = None
    created_at: datetime


class AdherenceEventBase(BaseModel):
    event_type: str
    event_date: datetime
    medication_name: Optional[str] = None
    days_supply: Optional[int] = None
    adherent: bool = True
    notes: Optional[str] = None


class AdherenceEventCreate(AdherenceEventBase):
    patient_id: UUID
    event_data: Optional[dict] = None


class AdherenceEventResponse(AdherenceEventBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    patient_id: UUID
    event_data: Optional[dict] = None
    created_at: datetime


class MarketingCampaignBase(BaseModel):
    campaign_name: str
    campaign_type: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    message_theme: Optional[str] = None
    patients_reached: int = 0
    engagement_rate: Optional[float] = None
    conversion_rate: Optional[float] = None


class MarketingCampaignCreate(MarketingCampaignBase):
    target_segment: Optional[dict] = None
    materials_shared: Optional[dict] = None


class MarketingCampaignResponse(MarketingCampaignBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    target_segment: Optional[dict] = None
    materials_shared: Optional[dict] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
