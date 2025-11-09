from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from uuid import UUID
import random

from app.core.database import get_db
from app.models import Call, Patient, Intervention, AdherenceEvent
from app.schemas.intervention import InterventionResponse

router = APIRouter()


@router.get("/intervention-effectiveness")
def get_intervention_effectiveness(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Calculate effectiveness of different intervention types
    Returns comparison of outcomes for patients who received interventions vs those who didn't
    """
    # Parse dates
    if start_date:
        start = datetime.fromisoformat(start_date)
    else:
        start = datetime.utcnow() - timedelta(days=90)

    if end_date:
        end = datetime.fromisoformat(end_date)
    else:
        end = datetime.utcnow()

    # Get all interventions in date range
    interventions = db.query(Intervention).filter(
        Intervention.created_at >= start,
        Intervention.created_at <= end
    ).all()

    # Mock data for demonstration (in production, this would come from actual adherence tracking)
    intervention_stats = {
        "copay_enrollment": {
            "total_interventions": 0,
            "patients_with_intervention": set(),
            "adherence_with": [],
            "adherence_without": [],
            "avg_cost_per_intervention": 45,
        },
        "nurse_callback": {
            "total_interventions": 0,
            "patients_with_intervention": set(),
            "adherence_with": [],
            "adherence_without": [],
            "avg_cost_per_intervention": 75,
        },
        "educational_material": {
            "total_interventions": 0,
            "patients_with_intervention": set(),
            "adherence_with": [],
            "adherence_without": [],
            "avg_cost_per_intervention": 15,
        },
        "prior_auth_support": {
            "total_interventions": 0,
            "patients_with_intervention": set(),
            "adherence_with": [],
            "adherence_without": [],
            "avg_cost_per_intervention": 120,
        },
        "home_delivery": {
            "total_interventions": 0,
            "patients_with_intervention": set(),
            "adherence_with": [],
            "adherence_without": [],
            "avg_cost_per_intervention": 25,
        },
    }

    # Process interventions
    for intervention in interventions:
        intervention_type = intervention.intervention_type
        if intervention_type in intervention_stats:
            intervention_stats[intervention_type]["total_interventions"] += 1
            intervention_stats[intervention_type]["patients_with_intervention"].add(
                intervention.patient_id
            )

            # Mock adherence data (in production, would query actual adherence events)
            if intervention.adherence_90_day is not None:
                adherence = intervention.adherence_90_day
            else:
                # Simulate adherence based on intervention type (higher for more effective interventions)
                adherence_rates = {
                    "copay_enrollment": 0.75,
                    "nurse_callback": 0.70,
                    "educational_material": 0.55,
                    "prior_auth_support": 0.78,
                    "home_delivery": 0.68,
                }
                adherence = random.random() < adherence_rates.get(intervention_type, 0.60)

            intervention_stats[intervention_type]["adherence_with"].append(adherence)

    # Generate comparison data (patients without intervention - mock)
    for intervention_type in intervention_stats:
        # Simulate control group (lower adherence rates)
        control_adherence_rate = 0.45  # Base adherence rate without intervention
        num_control = intervention_stats[intervention_type]["total_interventions"]

        for _ in range(num_control):
            adherent = random.random() < control_adherence_rate
            intervention_stats[intervention_type]["adherence_without"].append(adherent)

    # Calculate statistics
    results = []
    for intervention_type, stats in intervention_stats.items():
        if stats["total_interventions"] > 0:
            adherence_with = stats["adherence_with"]
            adherence_without = stats["adherence_without"]

            adherence_rate_with = (sum(adherence_with) / len(adherence_with) * 100) if adherence_with else 0
            adherence_rate_without = (sum(adherence_without) / len(adherence_without) * 100) if adherence_without else 45

            improvement = adherence_rate_with - adherence_rate_without

            # Calculate ROI (mock - assumes $150k annual revenue per adherent patient)
            revenue_per_patient = 150000
            patients_retained = (len(adherence_with) * (adherence_rate_with / 100)) - (len(adherence_with) * (adherence_rate_without / 100))
            revenue_saved = patients_retained * revenue_per_patient
            cost = len(adherence_with) * stats["avg_cost_per_intervention"]
            roi = ((revenue_saved - cost) / cost * 100) if cost > 0 else 0

            results.append({
                "intervention_type": intervention_type,
                "total_interventions": stats["total_interventions"],
                "unique_patients": len(stats["patients_with_intervention"]),
                "adherence_rate_with_intervention": round(adherence_rate_with, 1),
                "adherence_rate_without_intervention": round(adherence_rate_without, 1),
                "improvement_percentage": round(improvement, 1),
                "patients_retained": round(patients_retained, 1),
                "revenue_saved": round(revenue_saved, 2),
                "total_cost": round(cost, 2),
                "roi_percentage": round(roi, 1),
                "cost_per_intervention": stats["avg_cost_per_intervention"],
            })

    # Sort by improvement
    results.sort(key=lambda x: x["improvement_percentage"], reverse=True)

    total_revenue_saved = sum(r["revenue_saved"] for r in results)
    total_cost = sum(r["total_cost"] for r in results)
    total_interventions = sum(r["total_interventions"] for r in results)

    return {
        "date_range": {
            "start": start.isoformat(),
            "end": end.isoformat(),
        },
        "summary": {
            "total_interventions": total_interventions,
            "total_revenue_saved": round(total_revenue_saved, 2),
            "total_cost": round(total_cost, 2),
            "overall_roi": round(((total_revenue_saved - total_cost) / total_cost * 100) if total_cost > 0 else 0, 1),
        },
        "by_intervention_type": results,
    }


@router.get("/cohort-analysis")
def get_cohort_analysis(
    trigger_type: Optional[str] = None,
    intervention_type: Optional[str] = None,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Perform cohort analysis comparing patients with different triggers/interventions
    """
    # Get interventions
    query = db.query(Intervention)

    if trigger_type:
        query = query.filter(Intervention.trigger_type == trigger_type)

    if intervention_type:
        query = query.filter(Intervention.intervention_type == intervention_type)

    interventions = query.all()

    if not interventions:
        return {
            "trigger_type": trigger_type,
            "intervention_type": intervention_type,
            "cohort_size": 0,
            "cohorts": [],
        }

    # Group by intervention applied vs not applied
    cohorts = {
        "intervention_applied": [],
        "intervention_not_applied": [],
    }

    for intervention in interventions:
        cohort_key = "intervention_applied" if intervention.intervention_applied else "intervention_not_applied"

        # Mock adherence (in production, would query actual data)
        if intervention.adherence_90_day is not None:
            adherent = intervention.adherence_90_day
        else:
            adherent = random.random() < (0.70 if intervention.intervention_applied else 0.45)

        cohorts[cohort_key].append({
            "patient_id": str(intervention.patient_id),
            "adherent": adherent,
            "days_to_follow_up": random.randint(30, 90),
        })

    # Calculate statistics
    cohort_stats = []
    for cohort_name, cohort_data in cohorts.items():
        if cohort_data:
            adherence_rate = sum(1 for p in cohort_data if p["adherent"]) / len(cohort_data) * 100
            avg_follow_up = sum(p["days_to_follow_up"] for p in cohort_data) / len(cohort_data)

            cohort_stats.append({
                "cohort_name": cohort_name,
                "size": len(cohort_data),
                "adherence_rate": round(adherence_rate, 1),
                "avg_days_to_follow_up": round(avg_follow_up, 1),
            })

    return {
        "trigger_type": trigger_type,
        "intervention_type": intervention_type,
        "total_patients": len(interventions),
        "cohorts": cohort_stats,
    }


@router.get("/roi-calculator")
def calculate_roi(
    interventions_count: int = 100,
    intervention_cost: float = 50.0,
    baseline_adherence: float = 45.0,
    intervention_adherence: float = 70.0,
    annual_revenue_per_patient: float = 150000.0,
) -> Dict:
    """
    Calculate ROI for interventions with customizable parameters
    """
    # Calculate patients retained due to intervention
    patients_retained = interventions_count * ((intervention_adherence - baseline_adherence) / 100)

    # Calculate revenue
    revenue_saved = patients_retained * annual_revenue_per_patient

    # Calculate costs
    total_cost = interventions_count * intervention_cost

    # Calculate ROI
    net_benefit = revenue_saved - total_cost
    roi_percentage = (net_benefit / total_cost * 100) if total_cost > 0 else 0

    # Calculate payback period (months)
    monthly_benefit = revenue_saved / 12
    payback_months = (total_cost / monthly_benefit) if monthly_benefit > 0 else 0

    return {
        "inputs": {
            "interventions_count": interventions_count,
            "intervention_cost": intervention_cost,
            "baseline_adherence": baseline_adherence,
            "intervention_adherence": intervention_adherence,
            "annual_revenue_per_patient": annual_revenue_per_patient,
        },
        "results": {
            "patients_retained": round(patients_retained, 1),
            "revenue_saved": round(revenue_saved, 2),
            "total_cost": round(total_cost, 2),
            "net_benefit": round(net_benefit, 2),
            "roi_percentage": round(roi_percentage, 1),
            "payback_period_months": round(payback_months, 1),
        },
        "per_patient": {
            "revenue_per_retained_patient": round(annual_revenue_per_patient, 2),
            "cost_per_patient": intervention_cost,
            "net_value_per_patient": round((revenue_saved - total_cost) / interventions_count, 2),
        }
    }


@router.get("/time-to-abandonment")
def get_time_to_abandonment(
    db: Session = Depends(get_db)
) -> Dict:
    """
    Analyze time from trigger detection to patient abandonment
    Shows survival curves for different intervention types
    """
    # Mock survival data for demonstration
    intervention_types = [
        "copay_enrollment",
        "nurse_callback",
        "educational_material",
        "no_intervention"
    ]

    survival_data = {}

    for intervention_type in intervention_types:
        # Generate mock survival curve data (% still adherent over time)
        time_points = [0, 30, 60, 90, 120, 150, 180]  # days

        if intervention_type == "no_intervention":
            # Baseline decay
            survival_rates = [100, 75, 60, 48, 40, 35, 32]
        elif intervention_type == "copay_enrollment":
            # Better retention
            survival_rates = [100, 90, 85, 80, 78, 75, 73]
        elif intervention_type == "nurse_callback":
            # Good retention
            survival_rates = [100, 88, 82, 77, 74, 71, 69]
        else:  # educational_material
            # Moderate retention
            survival_rates = [100, 82, 72, 65, 60, 57, 55]

        survival_data[intervention_type] = [
            {"days": day, "adherence_rate": rate}
            for day, rate in zip(time_points, survival_rates)
        ]

    return {
        "survival_curves": survival_data,
        "time_points_days": [0, 30, 60, 90, 120, 150, 180],
    }
