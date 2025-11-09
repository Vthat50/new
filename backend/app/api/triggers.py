from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Optional
from uuid import UUID
from datetime import datetime, timedelta

from app.core.database import get_db
from app.models import Call, Patient, Intervention
from app.services.trigger_detection import (
    detect_triggers_in_transcript,
    calculate_abandonment_risk,
    analyze_call_for_triggers,
)

router = APIRouter()


@router.post("/analyze-call/{call_id}")
def analyze_call(
    call_id: UUID,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Analyze a specific call for abandonment triggers
    """
    call = db.query(Call).filter(Call.id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    patient = db.query(Patient).filter(Patient.id == call.patient_id).first()

    call_data = {
        "transcript": call.transcript or "",
        "patient_history": {
            "sdoh_risk_score": patient.sdoh_risk_score if patient else 0,
            "prior_abandonments": 0,  # Would come from historical data
            "missed_appointments": 0,
        }
    }

    analysis = analyze_call_for_triggers(call_data)

    return {
        "call_id": str(call_id),
        "patient_id": str(call.patient_id),
        "call_date": call.call_date.isoformat() if call.call_date else None,
        **analysis
    }


@router.get("/trigger-summary")
def get_trigger_summary(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Get summary statistics of triggers across all calls
    """
    # Parse dates
    if start_date:
        start = datetime.fromisoformat(start_date)
    else:
        start = datetime.utcnow() - timedelta(days=30)

    if end_date:
        end = datetime.fromisoformat(end_date)
    else:
        end = datetime.utcnow()

    # Get all calls in date range
    calls = db.query(Call).filter(
        Call.call_date >= start,
        Call.call_date <= end
    ).all()

    # Analyze all calls
    trigger_counts = {
        "cost_concern": 0,
        "injection_anxiety": 0,
        "side_effect_fear": 0,
        "insurance_denial": 0,
        "access_barrier": 0,
        "complexity_concern": 0,
    }

    total_calls = len(calls)
    calls_with_triggers = 0
    all_triggers = []

    for call in calls:
        if call.transcript:
            triggers = detect_triggers_in_transcript(call.transcript)
            if triggers:
                calls_with_triggers += 1
                all_triggers.extend(triggers)

                for trigger in triggers:
                    trigger_type = trigger["trigger_type"]
                    if trigger_type in trigger_counts:
                        trigger_counts[trigger_type] += 1

    # Calculate percentages
    trigger_percentages = {}
    if total_calls > 0:
        for trigger_type, count in trigger_counts.items():
            trigger_percentages[trigger_type] = {
                "count": count,
                "percentage": round((count / total_calls) * 100, 1)
            }

    # Find most common trigger combinations
    trigger_combinations = {}
    for call in calls:
        if call.transcript:
            triggers = detect_triggers_in_transcript(call.transcript)
            if len(triggers) > 1:
                combo = tuple(sorted([t["trigger_type"] for t in triggers[:2]]))
                trigger_combinations[combo] = trigger_combinations.get(combo, 0) + 1

    top_combinations = sorted(
        trigger_combinations.items(),
        key=lambda x: x[1],
        reverse=True
    )[:5]

    return {
        "date_range": {
            "start": start.isoformat(),
            "end": end.isoformat(),
        },
        "total_calls": total_calls,
        "calls_with_triggers": calls_with_triggers,
        "trigger_rate": round((calls_with_triggers / total_calls * 100), 1) if total_calls > 0 else 0,
        "trigger_breakdown": trigger_percentages,
        "top_trigger_combinations": [
            {
                "triggers": list(combo),
                "count": count,
                "percentage": round((count / calls_with_triggers * 100), 1) if calls_with_triggers > 0 else 0
            }
            for combo, count in top_combinations
        ],
        "total_triggers_detected": len(all_triggers),
    }


@router.get("/patient-risk/{patient_id}")
def get_patient_risk(
    patient_id: UUID,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Calculate abandonment risk for a specific patient based on their call history
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Get all patient calls
    calls = db.query(Call).filter(
        Call.patient_id == patient_id
    ).order_by(Call.call_date.desc()).all()

    if not calls:
        return {
            "patient_id": str(patient_id),
            "risk_score": 20,
            "risk_level": "low",
            "triggers_found": [],
            "call_count": 0,
        }

    # Analyze recent calls (last 5)
    recent_calls = calls[:5]
    all_triggers = []

    for call in recent_calls:
        if call.transcript:
            triggers = detect_triggers_in_transcript(call.transcript)
            all_triggers.extend(triggers)

    # Calculate risk
    patient_history = {
        "sdoh_risk_score": patient.sdoh_risk_score or 0,
        "prior_abandonments": 0,
        "missed_appointments": 0,
    }

    risk_score, risk_level = calculate_abandonment_risk(all_triggers, patient_history)

    # Group triggers by type
    trigger_summary = {}
    for trigger in all_triggers:
        trigger_type = trigger["trigger_type"]
        if trigger_type not in trigger_summary:
            trigger_summary[trigger_type] = {
                "count": 0,
                "avg_confidence": 0,
                "severity": trigger["severity"],
            }
        trigger_summary[trigger_type]["count"] += 1
        trigger_summary[trigger_type]["avg_confidence"] += trigger["confidence"]

    # Calculate averages
    for trigger_type in trigger_summary:
        count = trigger_summary[trigger_type]["count"]
        trigger_summary[trigger_type]["avg_confidence"] = round(
            trigger_summary[trigger_type]["avg_confidence"] / count, 2
        )

    return {
        "patient_id": str(patient_id),
        "patient_name": f"{patient.first_name} {patient.last_name}",
        "risk_score": risk_score,
        "risk_level": risk_level,
        "call_count": len(calls),
        "triggers_found": trigger_summary,
        "total_trigger_count": len(all_triggers),
        "last_call_date": calls[0].call_date.isoformat() if calls[0].call_date else None,
        "sdoh_risk_score": patient.sdoh_risk_score,
        "journey_stage": patient.journey_stage,
    }


@router.get("/high-risk-patients")
def get_high_risk_patients(
    limit: int = 50,
    db: Session = Depends(get_db)
) -> List[Dict]:
    """
    Get list of patients with high abandonment risk
    """
    # Get all active patients
    patients = db.query(Patient).filter(
        Patient.status == "active"
    ).all()

    patient_risks = []

    for patient in patients[:limit]:  # Limit to avoid timeout
        # Get recent calls
        calls = db.query(Call).filter(
            Call.patient_id == patient.id
        ).order_by(Call.call_date.desc()).limit(3).all()

        all_triggers = []
        for call in calls:
            if call.transcript:
                triggers = detect_triggers_in_transcript(call.transcript)
                all_triggers.extend(triggers)

        if all_triggers or patient.sdoh_risk_score > 60:
            risk_score, risk_level = calculate_abandonment_risk(
                all_triggers,
                {"sdoh_risk_score": patient.sdoh_risk_score or 0}
            )

            if risk_score >= 60:  # High risk threshold
                patient_risks.append({
                    "patient_id": str(patient.id),
                    "mrn": patient.mrn,
                    "name": f"{patient.first_name} {patient.last_name}",
                    "risk_score": risk_score,
                    "risk_level": risk_level,
                    "trigger_count": len(all_triggers),
                    "sdoh_risk_score": patient.sdoh_risk_score,
                    "journey_stage": patient.journey_stage,
                    "last_contact": patient.last_contact_date.isoformat() if patient.last_contact_date else None,
                })

    # Sort by risk score
    patient_risks.sort(key=lambda x: x["risk_score"], reverse=True)

    return patient_risks
