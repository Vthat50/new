from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime
from uuid import UUID


class PatientBase(BaseModel):
    mrn: str
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    zip_code: Optional[str] = None
    state: Optional[str] = None
    insurance_type: Optional[str] = None
    insurance_plan_id: Optional[str] = None
    insurance_plan_name: Optional[str] = None
    sdoh_risk_score: Optional[int] = 0
    status: Optional[str] = "active"
    journey_stage: Optional[str] = None
    adherence_score: Optional[int] = 75
    last_contact_date: Optional[datetime] = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    zip_code: Optional[str] = None
    insurance_type: Optional[str] = None
    insurance_plan_id: Optional[str] = None
    insurance_plan_name: Optional[str] = None
    status: Optional[str] = None


class Patient(PatientBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PatientWithEnrichment(Patient):
    """Patient with enriched SDOH and coverage data"""
    geographic_profile: Optional[dict] = None
    coverage_info: Optional[dict] = None
    eligible_programs: Optional[list] = None
