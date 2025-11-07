from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import random
from datetime import datetime
from app.api.dependencies import get_db
from app.models.call import Call
from app.models.patient import Patient
from app.models.geographic import GeographicProfile
from app.schemas.call import Call as CallSchema, CallCreate, CallAnalysis

router = APIRouter(prefix="/api/calls", tags=["calls"])


@router.get("/", response_model=List[CallSchema])
def get_calls(
    patient_id: UUID = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all calls, optionally filtered by patient"""
    query = db.query(Call)
    if patient_id:
        query = query.filter(Call.patient_id == patient_id)

    return query.order_by(Call.call_date.desc()).offset(skip).limit(limit).all()


@router.get("/{call_id}", response_model=CallSchema)
def get_call(call_id: UUID, db: Session = Depends(get_db)):
    """Get a single call"""
    call = db.query(Call).filter(Call.id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return call


@router.post("/analyze", response_model=CallAnalysis)
async def analyze_call(
    patient_id: UUID,
    audio_file: UploadFile = File(None),
    transcript: str = None,
    db: Session = Depends(get_db)
):
    """
    Simulate voice AI analysis of a call
    In production, this would:
    1. Transcribe audio with Deepgram
    2. Extract entities with LLM
    3. Enrich with SDOH/formulary data
    4. Generate recommendations
    """
    # Get patient
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Mock transcript if not provided
    if not transcript:
        transcript = f"""AI: Hi {patient.first_name}, I'm calling to help you with your medication access. Can you confirm your ZIP code?
Patient: Yes, it's {patient.zip_code}.
AI: Thank you. I see you have {patient.insurance_type} insurance. Are you experiencing any difficulties accessing or affording your medication?
Patient: Yes, the copay is quite high and I also have trouble getting to the pharmacy.
AI: I understand. Let me see what programs you qualify for to help with both the cost and access."""

    # Extract mock patient data
    patient_data = {
        "zip_code": patient.zip_code,
        "insurance": patient.insurance_type,
        "insurance_plan": patient.insurance_plan_id,
        "concerns": ["cost", "transportation"]
    }

    # Enrich with geographic data
    geo = db.query(GeographicProfile).filter(GeographicProfile.zip_code == patient.zip_code).first()
    enrichment_data = {
        "sdoh": {
            "urban_rural": geo.urban_rural_classification if geo else "unknown",
            "transportation_score": geo.sdoh_factors.get("transportation", 50) if geo and geo.sdoh_factors else 50,
            "health_literacy": geo.sdoh_factors.get("health_literacy", 50) if geo and geo.sdoh_factors else 50,
            "nearest_pharmacy_miles": float(geo.nearest_pharmacy_miles) if geo and geo.nearest_pharmacy_miles else None
        },
        "coverage": {
            "has_insurance": patient.insurance_type != "Uninsured",
            "estimated_copay": random.randint(50, 200) if patient.insurance_type != "Uninsured" else None
        }
    }

    # Identify barriers
    barriers = []
    if enrichment_data["sdoh"]["transportation_score"] < 50 or (geo and geo.nearest_pharmacy_miles and float(geo.nearest_pharmacy_miles) > 10):
        barriers.append("transportation")
    if enrichment_data["coverage"]["estimated_copay"] and enrichment_data["coverage"]["estimated_copay"] > 100:
        barriers.append("cost")
    if enrichment_data["sdoh"]["health_literacy"] < 60:
        barriers.append("health_literacy")

    # Generate recommendations
    recommendations = []
    if "transportation" in barriers:
        recommendations.append({
            "action": "enroll_home_delivery",
            "priority": "high",
            "rationale": "Patient in area with transportation barriers",
            "estimated_impact": "Eliminates travel requirement"
        })
    if "cost" in barriers:
        recommendations.append({
            "action": "enroll_copay_assistance",
            "priority": "high",
            "rationale": f"Copay of ${enrichment_data['coverage']['estimated_copay']} exceeds threshold",
            "estimated_savings": enrichment_data['coverage']['estimated_copay']
        })
    if "health_literacy" in barriers:
        recommendations.append({
            "action": "simplified_instructions",
            "priority": "medium",
            "rationale": "Low health literacy score in region",
            "estimated_impact": "Improved adherence"
        })

    # Generate call summary
    call_summary = f"Patient {patient.first_name} {patient.last_name} contacted regarding medication access. "
    call_summary += f"Identified barriers: {', '.join(barriers)}. "
    call_summary += f"Recommended {len(recommendations)} interventions."

    return {
        "transcript": transcript,
        "patient_data": patient_data,
        "enrichment_data": enrichment_data,
        "barriers": barriers,
        "recommendations": recommendations,
        "call_summary": call_summary
    }


@router.post("/", response_model=CallSchema)
def create_call(call: CallCreate, db: Session = Depends(get_db)):
    """Create a new call record"""
    db_call = Call(**call.dict())
    db.add(db_call)
    db.commit()
    db.refresh(db_call)
    return db_call
