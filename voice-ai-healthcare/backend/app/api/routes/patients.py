from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.api.dependencies import get_db
from app.models.patient import Patient
from app.models.geographic import GeographicProfile
from app.models.formulary import Formulary
from app.models.program import AssistanceProgram, Enrollment
from app.schemas.patient import Patient as PatientSchema, PatientWithEnrichment, PatientCreate, PatientUpdate

router = APIRouter(prefix="/api/patients", tags=["patients"])


@router.get("/", response_model=List[PatientSchema])
def get_patients(
    skip: int = 0,
    limit: int = 100,
    insurance_type: Optional[str] = None,
    state: Optional[str] = None,
    status: Optional[str] = None,
    risk_level: Optional[str] = None,  # high, medium, low
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all patients with optional filtering"""
    query = db.query(Patient)

    # Apply filters
    if insurance_type:
        query = query.filter(Patient.insurance_type == insurance_type)
    if state:
        query = query.filter(Patient.state == state)
    if status:
        query = query.filter(Patient.status == status)
    if risk_level:
        if risk_level == "high":
            query = query.filter(Patient.sdoh_risk_score >= 70)
        elif risk_level == "medium":
            query = query.filter(Patient.sdoh_risk_score >= 40, Patient.sdoh_risk_score < 70)
        elif risk_level == "low":
            query = query.filter(Patient.sdoh_risk_score < 40)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Patient.first_name.ilike(search_filter)) |
            (Patient.last_name.ilike(search_filter)) |
            (Patient.mrn.ilike(search_filter))
        )

    return query.offset(skip).limit(limit).all()


@router.get("/{patient_id}", response_model=PatientWithEnrichment)
def get_patient(patient_id: UUID, db: Session = Depends(get_db)):
    """Get a single patient with enriched data"""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Enrich with geographic data
    geographic_profile = None
    if patient.zip_code:
        geo = db.query(GeographicProfile).filter(GeographicProfile.zip_code == patient.zip_code).first()
        if geo:
            geographic_profile = {
                "zip_code": geo.zip_code,
                "urban_rural": geo.urban_rural_classification,
                "sdoh_factors": geo.sdoh_factors,
                "nearest_pharmacy_miles": float(geo.nearest_pharmacy_miles) if geo.nearest_pharmacy_miles else None
            }

    # Get coverage info from formulary
    coverage_info = None
    if patient.insurance_plan_id:
        formulary = db.query(Formulary).filter(
            Formulary.plan_id == patient.insurance_plan_id
        ).first()
        if formulary:
            coverage_info = {
                "plan_name": formulary.plan_name,
                "tier": formulary.tier,
                "pa_required": formulary.pa_required,
                "estimated_copay": float(formulary.estimated_copay) if formulary.estimated_copay else None
            }

    # Get eligible programs
    eligible_programs = []
    programs = db.query(AssistanceProgram).limit(3).all()  # Simplified - would calculate eligibility
    for program in programs:
        eligible_programs.append({
            "id": str(program.id),
            "name": program.program_name,
            "type": program.program_type,
            "max_benefit": float(program.max_benefit_amount) if program.max_benefit_amount else None
        })

    # Convert to dict and add enrichment
    patient_dict = {
        "id": patient.id,
        "mrn": patient.mrn,
        "first_name": patient.first_name,
        "last_name": patient.last_name,
        "date_of_birth": patient.date_of_birth,
        "phone": patient.phone,
        "email": patient.email,
        "zip_code": patient.zip_code,
        "state": patient.state,
        "insurance_type": patient.insurance_type,
        "insurance_plan_id": patient.insurance_plan_id,
        "insurance_plan_name": patient.insurance_plan_name,
        "sdoh_risk_score": patient.sdoh_risk_score,
        "status": patient.status,
        "created_at": patient.created_at,
        "updated_at": patient.updated_at,
        "geographic_profile": geographic_profile,
        "coverage_info": coverage_info,
        "eligible_programs": eligible_programs
    }

    return patient_dict


@router.post("/", response_model=PatientSchema)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    """Create a new patient"""
    db_patient = Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


@router.patch("/{patient_id}", response_model=PatientSchema)
def update_patient(patient_id: UUID, patient_update: PatientUpdate, db: Session = Depends(get_db)):
    """Update a patient"""
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    for field, value in patient_update.dict(exclude_unset=True).items():
        setattr(db_patient, field, value)

    db.commit()
    db.refresh(db_patient)
    return db_patient
