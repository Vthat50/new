from faker import Faker
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import (
    Patient, Call, GeographicProfile, Formulary,
    AssistanceProgram, Enrollment, DataIntegration,
    Intervention, AdherenceEvent, MarketingCampaign
)

fake = Faker()

# Mock data constants
INSURANCE_TYPES = ["Medicare", "Medicaid", "Commercial", "Uninsured"]
STATES = ["CA", "NY", "TX", "FL", "PA", "IL", "OH", "GA", "NC", "MI", "KY", "WV"]
URBAN_RURAL = ["rural", "urban", "suburban"]
BARRIERS = ["transportation", "cost", "health_literacy", "food_insecurity", "housing_instability"]
PROGRAM_TYPES = ["copay_assistance", "bridge", "pap", "foundation"]
DRUG_NAMES = [
    "Humira", "Enbrel", "Keytruda", "Opdivo", "Eliquis",
    "Xarelto", "Ozempic", "Jardiance", "Entresto", "Dupixent"
]
JOURNEY_STAGES = ["new_start", "pa_pending", "active_treatment", "at_risk", "churned"]
CALL_DIRECTIONS = ["inbound", "outbound"]
CALL_OUTCOMES = ["resolved", "escalated", "callback_scheduled", "no_answer", "voicemail"]
FRICTION_TOPICS = [
    "PA Delays", "High Costs", "Pharmacy Issues", "Insurance Questions",
    "Side Effects", "Refill Problems", "Dosage Confusion", "Financial Hardship",
    "Access to Care", "Transportation Barriers", "Language Barriers"
]


def generate_mock_patients(db: Session, count: int = 500):
    """Generate mock patient records with journey stages"""
    patients = []
    for i in range(count):
        zip_code = fake.zipcode()
        state = random.choice(STATES)
        insurance_type = random.choice(INSURANCE_TYPES)
        journey_stage = random.choice(JOURNEY_STAGES)

        # Generate SDOH risk score (higher for rural, uninsured, at_risk patients)
        base_score = random.randint(20, 80)
        if insurance_type == "Uninsured":
            base_score = min(100, base_score + 20)
        if journey_stage == "at_risk":
            base_score = max(base_score, 70)
        elif journey_stage == "churned":
            base_score = max(base_score, 60)

        # Adherence score correlates with journey stage
        adherence_map = {
            "new_start": random.randint(50, 75),
            "pa_pending": random.randint(60, 80),
            "active_treatment": random.randint(80, 95),
            "at_risk": random.randint(40, 65),
            "churned": random.randint(20, 50)
        }
        adherence_score = adherence_map[journey_stage]

        # Last contact within last 30 days (or longer ago for churned patients)
        days_ago = random.randint(1, 90) if journey_stage == "churned" else random.randint(1, 30)
        last_contact_date = datetime.now() - timedelta(days=days_ago)

        patient = Patient(
            mrn=f"MRN{100000 + i}",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            date_of_birth=fake.date_of_birth(minimum_age=18, maximum_age=85),
            phone=fake.phone_number()[:20],
            email=fake.email(),
            zip_code=zip_code[:5],
            state=state,
            insurance_type=insurance_type,
            insurance_plan_id=f"PLAN-{random.randint(1000, 9999)}" if insurance_type != "Uninsured" else None,
            insurance_plan_name=f"{insurance_type} Plan {random.choice(['A', 'B', 'C'])}" if insurance_type != "Uninsured" else None,
            sdoh_risk_score=base_score,
            journey_stage=journey_stage,
            adherence_score=adherence_score,
            last_contact_date=last_contact_date,
            status=random.choice(["active", "active", "active", "pending", "new"])  # Weighted towards active
        )
        db.add(patient)
        patients.append(patient)

    db.commit()
    return patients


def generate_mock_geographic_profiles(db: Session, count: int = 30):
    """Generate mock geographic SDOH profiles"""
    profiles = []
    for i in range(count):
        state = random.choice(STATES)
        classification = random.choice(URBAN_RURAL)

        # Generate SDOH factors (rural areas have lower scores)
        transportation_score = random.randint(20, 50) if classification == "rural" else random.randint(60, 90)
        health_literacy = random.randint(30, 60) if classification == "rural" else random.randint(70, 95)

        profile = GeographicProfile(
            zip_code=fake.zipcode()[:5],
            county_fips=f"{random.randint(10000, 99999)}",
            county_name=fake.city() + " County",
            state=state,
            urban_rural_classification=classification,
            sdoh_factors={
                "transportation": transportation_score,
                "health_literacy": health_literacy,
                "food_security": random.randint(40, 90),
                "housing_stability": random.randint(50, 85),
                "access_to_care": transportation_score
            },
            disease_prevalence={
                "diabetes": round(random.uniform(0.08, 0.15), 3),
                "hypertension": round(random.uniform(0.20, 0.35), 3),
                "obesity": round(random.uniform(0.25, 0.40), 3),
                "copd": round(random.uniform(0.05, 0.12), 3)
            },
            provider_count=random.randint(1, 50) if classification == "rural" else random.randint(50, 300),
            nearest_pharmacy_miles=round(random.uniform(0.5, 25), 1) if classification == "rural" else round(random.uniform(0.2, 3), 1),
            demographics={
                "population": random.randint(5000, 100000),
                "median_income": random.randint(30000, 85000),
                "median_age": random.randint(32, 55),
                "percent_over_65": round(random.uniform(0.10, 0.25), 2)
            }
        )
        db.add(profile)
        profiles.append(profile)

    db.commit()
    return profiles


def generate_mock_formularies(db: Session, count: int = 100):
    """Generate mock insurance formulary data"""
    formularies = []
    plan_types = ["Medicare Advantage", "Medicaid", "Commercial"]

    for i in range(count):
        drug_name = random.choice(DRUG_NAMES)
        plan_type = random.choice(plan_types)
        tier = random.randint(1, 5)

        # Higher tiers = higher copays
        copay_ranges = {1: (5, 20), 2: (20, 50), 3: (50, 150), 4: (150, 400), 5: (400, 1000)}
        copay = round(random.uniform(*copay_ranges[tier]), 2)

        formulary = Formulary(
            plan_id=f"PLAN-{random.randint(1000, 9999)}",
            plan_name=f"{plan_type} Plan {random.choice(['Gold', 'Silver', 'Bronze'])}",
            plan_type=plan_type,
            state=random.choice(STATES),
            drug_ndc=f"{random.randint(10000, 99999)}{random.randint(100, 999)}{random.randint(10, 99)}",
            drug_name=drug_name,
            tier=tier,
            pa_required=random.choice([True, False]) if tier >= 3 else False,
            quantity_limits="30 tablets per 30 days" if random.random() > 0.5 else None,
            step_therapy=random.choice([True, False]) if tier >= 3 else False,
            estimated_copay=copay,
            formulary_data={
                "restrictions": ["Prior Authorization"] if tier >= 3 else [],
                "alternatives": [random.choice(DRUG_NAMES) for _ in range(2)]
            },
            effective_date=datetime.now().date() - timedelta(days=random.randint(0, 365))
        )
        db.add(formulary)
        formularies.append(formulary)

    db.commit()
    return formularies


def generate_mock_assistance_programs(db: Session, count: int = 20):
    """Generate mock patient assistance programs"""
    programs = []
    manufacturers = ["PharmaCo", "MediTech", "BioHealth", "CurePharma", "GlobalMed"]

    for i in range(count):
        program_type = random.choice(PROGRAM_TYPES)
        drug_name = random.choice(DRUG_NAMES)

        program = AssistanceProgram(
            program_name=f"{drug_name} {program_type.replace('_', ' ').title()}",
            program_type=program_type,
            manufacturer=random.choice(manufacturers),
            drug_ndc=f"{random.randint(10000, 99999)}{random.randint(100, 999)}{random.randint(10, 99)}",
            drug_name=drug_name,
            income_threshold_fpl=random.choice([2.0, 3.0, 4.0, 5.0]),  # 200%, 300%, 400%, 500% FPL
            max_benefit_amount=round(random.uniform(1000, 10000), 2),
            eligibility_criteria={
                "min_age": 18,
                "requires_insurance": program_type == "copay_assistance",
                "income_verification": True,
                "citizenship_required": program_type == "pap"
            },
            application_url=f"https://www.{drug_name.lower()}assistance.com",
            phone_number=fake.phone_number()[:20]
        )
        db.add(program)
        programs.append(program)

    db.commit()
    return programs


def generate_mock_calls(db: Session, patients: list, calls_per_patient: int = 3):
    """Generate comprehensive 30-day call history for all patients"""
    calls = []

    # Expanded realistic transcripts
    sample_transcripts = [
        {
            "transcript": "AI: Good morning! This is PharmAI calling about your Humira prescription. Is this a good time to talk? Patient: Yes, hi. I've been waiting for this call. AI: Great! I see your prior authorization was approved yesterday. Your medication will be delivered to your home within 2 days. Patient: Oh wonderful! I was so worried about the cost. AI: You're enrolled in our copay assistance program, so your out-of-pocket cost will be just $5. Patient: That's amazing, thank you so much!",
            "sentiment": 0.9,
            "friction": [],
            "outcome": "resolved",
            "barriers": [],
            "programs": ["copay_assistance"]
        },
        {
            "transcript": "AI: Hi, I'm calling to check on your medication adherence. How have you been doing with taking your Ozempic? Patient: Honestly, I've been missing doses. I keep forgetting. AI: I understand. Would you like me to set up daily text reminders? Patient: Yes, that would help a lot. AI: Perfect. I've also noticed your pharmacy is 25 miles away. Would home delivery make it easier? Patient: Absolutely! I didn't know that was an option. AI: Let me enroll you right now.",
            "sentiment": 0.7,
            "friction": ["Refill Problems"],
            "outcome": "resolved",
            "barriers": ["transportation", "health_literacy"],
            "programs": []
        },
        {
            "transcript": "Patient: I'm calling because my insurance denied my prescription! AI: I'm sorry to hear that. Let me look into this. Can you tell me which medication? Patient: It's Keytruda for my cancer treatment. AI: I see the issue. Your insurance requires step therapy - they want you to try a different medication first. Patient: But my doctor specifically prescribed this one! AI: I completely understand your frustration. Let me help you file a medical exception with your doctor's support. This usually takes 3-5 business days. Patient: Okay, please do whatever you can. I'm really worried.",
            "sentiment": 0.3,
            "friction": ["PA Delays", "Insurance Questions"],
            "outcome": "escalated",
            "barriers": ["cost"],
            "programs": []
        },
        {
            "transcript": "AI: Hello, this is a refill reminder for your Eliquis prescription. You have 5 days of medication left. Would you like me to process your refill? Patient: Yes please. Will it be delivered or do I need to pick it up? AI: It will be delivered to your home address on file. You should receive it in 2 days. Patient: Perfect, thank you!",
            "sentiment": 0.8,
            "friction": [],
            "outcome": "resolved",
            "barriers": [],
            "programs": []
        },
        {
            "transcript": "Patient: I need help understanding my bill. I thought my copay was supposed to be covered? AI: Let me pull up your account. I see you're enrolled in the patient assistance program. Can you tell me what amount you were charged? Patient: It says $89. AI: That doesn't look right. Let me contact your pharmacy directly. Please hold. [pause] Thank you for holding. I've confirmed with the pharmacy that they incorrectly processed your claim. They're issuing a full refund and reprocessing with your assistance program. Patient: Oh thank goodness! I was so confused.",
            "sentiment": 0.5,
            "friction": ["High Costs", "Pharmacy Issues"],
            "outcome": "resolved",
            "barriers": ["cost"],
            "programs": ["copay_assistance"]
        },
        {
            "transcript": "AI: I'm calling to follow up on your prior authorization request from last week. Patient: Yes? What's the status? AI: Unfortunately, it was denied by your insurance. However, I have good news - you qualify for the manufacturer's patient assistance program which will provide your medication at no cost. Patient: Really? How long will that take? AI: I can complete your enrollment right now over the phone. You'll receive your medication within 5 business days. Patient: That's such a relief!",
            "sentiment": 0.7,
            "friction": ["PA Delays", "High Costs"],
            "outcome": "resolved",
            "barriers": ["cost"],
            "programs": ["pap"]
        },
        {
            "transcript": "Patient: I'm having side effects from my new medication. Should I stop taking it? AI: I understand you're concerned. Can you describe the side effects you're experiencing? Patient: I'm feeling dizzy and nauseous. AI: This is important. I'm going to connect you with a pharmacist right away for a clinical consultation. Please hold. Patient: Okay, thank you.",
            "sentiment": 0.4,
            "friction": ["Side Effects"],
            "outcome": "escalated",
            "barriers": [],
            "programs": []
        },
        {
            "transcript": "AI: This is an outbound call to check on your recent enrollment in our bridge program. Did you receive your starter supply of Enbrel? Patient: Yes, it arrived yesterday. AI: Excellent! Do you have any questions about how to administer the injection? Patient: Actually yes, I'm nervous about giving myself a shot. AI: That's completely normal. I'm going to send you a video tutorial and schedule a nurse visit to help with your first injection. Would tomorrow at 2 PM work? Patient: Yes, that would be perfect. Thank you so much.",
            "sentiment": 0.8,
            "friction": ["Dosage Confusion"],
            "outcome": "resolved",
            "barriers": ["health_literacy"],
            "programs": ["bridge"]
        },
        {
            "transcript": "Patient: I've been trying to reach my doctor's office for three days about my prescription! AI: I'm sorry you've been having difficulty. What do you need help with? Patient: I need a prior authorization form filled out, but no one is calling me back. AI: I can help with that. I have the form here and I'll fax it directly to your doctor with a follow-up call. I'll also give you a direct line to their office. Patient: Finally! Someone who can actually help. AI: I'll make sure this gets done today.",
            "sentiment": 0.5,
            "friction": ["PA Delays", "Access to Care"],
            "outcome": "resolved",
            "barriers": [],
            "programs": []
        },
        {
            "transcript": "AI: Good afternoon! I'm calling with an update on your financial assistance application. Patient: Oh good, I've been waiting to hear. AI: Great news - you've been approved for 12 months of coverage. Your medication will cost $0. Patient: [crying] I can't believe it. I was about to stop treatment because I couldn't afford it. AI: I'm so glad we could help. You'll receive a welcome packet in the mail with all the details. Patient: Thank you, thank you so much.",
            "sentiment": 0.95,
            "friction": [],
            "outcome": "resolved",
            "barriers": ["cost", "food_insecurity"],
            "programs": ["pap", "foundation"]
        },
        {
            "transcript": "Patient: I'm calling because my pharmacy says my medication is on backorder. What do I do? AI: Let me check our pharmacy network. [pause] I found three pharmacies within 10 miles of you that have it in stock. I can transfer your prescription right now. Which location works best for you? Patient: The one on Main Street would be perfect. AI: Done. It'll be ready for pickup in one hour. I'm also adding you to our inventory alert system so this doesn't happen again.",
            "sentiment": 0.7,
            "friction": ["Pharmacy Issues"],
            "outcome": "resolved",
            "barriers": ["transportation"],
            "programs": []
        },
        {
            "transcript": "AI: This is a courtesy call to let you know your medication is being delivered today between 2-4 PM. Patient: I won't be home then. Can you change the delivery? AI: Absolutely. What day and time works better for you? Patient: Can you do Saturday morning? AI: Yes, I've rescheduled for Saturday between 9-11 AM. You'll get a text reminder the day before. Patient: Perfect, thank you!",
            "sentiment": 0.85,
            "friction": [],
            "outcome": "resolved",
            "barriers": [],
            "programs": []
        },
        {
            "transcript": "Patient: I got a call that my insurance changed and I need to re-enroll in the assistance program? AI: Yes, that's correct. Your employer switched insurance plans, so we need to update your information. It only takes a few minutes. Patient: This is so frustrating. Do I have to pay full price now? AI: No, don't worry. Your current enrollment stays active while we process the update. You won't have any gap in coverage. Patient: Okay, that's good at least. Let's get this done.",
            "sentiment": 0.5,
            "friction": ["Insurance Questions"],
            "outcome": "resolved",
            "barriers": [],
            "programs": ["copay_assistance"]
        },
        {
            "transcript": "[Outbound call - no answer, left voicemail] AI: Hello, this is PharmAI calling for Sarah Martinez regarding your Dupixent prescription. We have an important update about your prior authorization. Please call us back at 1-800-555-0123. Thank you.",
            "sentiment": 0.5,
            "friction": [],
            "outcome": "voicemail",
            "barriers": [],
            "programs": []
        },
        {
            "transcript": "Patient: My medication was supposed to arrive 3 days ago and it's still not here! AI: I sincerely apologize for the delay. Let me track your shipment right now. [pause] I see the carrier had a delay in your area due to weather. Your package is now scheduled for delivery tomorrow with guaranteed delivery. Patient: This is unacceptable. I'm almost out of my medication! AI: I completely understand your frustration. Let me see if I can get you an emergency supply from a local pharmacy today. Patient: Yes, please do that.",
            "sentiment": 0.3,
            "friction": ["Pharmacy Issues", "Access to Care"],
            "outcome": "escalated",
            "barriers": [],
            "programs": []
        }
    ]

    print(f"Generating calls for {len(patients)} patients...")

    for patient in patients:
        # Generate 1-5 calls per patient over last 30 days
        num_calls = random.randint(1, min(calls_per_patient, 5))

        for call_num in range(num_calls):
            # Select random transcript
            transcript_data = random.choice(sample_transcripts)

            # Generate call date spread over 30 days
            days_ago = random.randint(0, 30)
            call_date = datetime.now() - timedelta(days=days_ago)

            # Random call direction (70% inbound, 30% outbound)
            call_direction = random.choices(CALL_DIRECTIONS, weights=[0.7, 0.3])[0]

            # Duration varies by outcome
            if transcript_data["outcome"] == "voicemail":
                duration = random.randint(20, 45)
            elif transcript_data["outcome"] == "no_answer":
                duration = random.randint(15, 30)
            elif transcript_data["outcome"] == "escalated":
                duration = random.randint(300, 900)
            else:
                duration = random.randint(120, 480)

            # Select friction topics (0-3 topics)
            friction_topics = random.sample(FRICTION_TOPICS, k=random.randint(0, min(3, len(FRICTION_TOPICS)))) if random.random() > 0.5 else transcript_data["friction"]

            call = Call(
                patient_id=patient.id,
                audio_file_url=f"/uploads/call_{patient.mrn}_{call_num}.wav",
                transcript=transcript_data["transcript"],
                duration_seconds=duration,
                call_date=call_date,
                call_direction=call_direction,
                sentiment_score=transcript_data["sentiment"] + random.uniform(-0.1, 0.1),  # Add slight variation
                friction_topics=friction_topics,
                outcome=transcript_data["outcome"],
                barriers_identified=transcript_data["barriers"],
                programs_enrolled=transcript_data["programs"],
                actions_taken={
                    "home_delivery": "transportation" in transcript_data["barriers"],
                    "simplified_instructions": "health_literacy" in transcript_data["barriers"],
                    "copay_assistance": "cost" in transcript_data["barriers"],
                    "pa_support": "PA Delays" in friction_topics
                },
                ai_recommendations={
                    "immediate": [
                        {"action": "enroll_home_delivery", "priority": "high"} if "transportation" in transcript_data["barriers"] else None,
                        {"action": "enroll_pap", "priority": "high", "estimated_savings": random.randint(50, 500)} if "cost" in transcript_data["barriers"] else None,
                        {"action": "clinical_consultation", "priority": "urgent"} if "Side Effects" in friction_topics else None
                    ],
                    "follow_up": [
                        {"action": "adherence_check", "days": 14},
                        {"action": "refill_reminder", "days": 25},
                        {"action": "satisfaction_survey", "days": 3}
                    ]
                },
                call_summary=f"{'Inbound' if call_direction == 'inbound' else 'Outbound'} call - {transcript_data['outcome']}. " +
                            (f"Friction: {', '.join(friction_topics)}. " if friction_topics else "") +
                            f"Sentiment: {transcript_data['sentiment']:.0%}."
            )
            db.add(call)
            calls.append(call)

    db.commit()
    print(f"✓ Generated {len(calls)} calls")
    return calls


def generate_mock_enrollments(db: Session, patients: list, programs: list, calls: list, count: int = 40):
    """Generate mock program enrollments"""
    enrollments = []

    for i in range(count):
        patient = random.choice(patients)
        program = random.choice(programs)
        call = random.choice(calls) if random.random() > 0.3 else None

        enrollment = Enrollment(
            patient_id=patient.id,
            program_id=program.id,
            call_id=call.id if call else None,
            enrollment_date=datetime.now() - timedelta(days=random.randint(0, 90)),
            status=random.choice(["active", "active", "active", "pending", "approved"]),  # Weighted
            estimated_savings=round(random.uniform(50, 500), 2),
            renewal_date=(datetime.now() + timedelta(days=random.randint(30, 365))).date(),
            notes=f"Enrolled via {'voice AI call' if call else 'manual process'}"
        )
        db.add(enrollment)
        enrollments.append(enrollment)

    db.commit()
    return enrollments


def generate_mock_integrations(db: Session):
    """Generate mock data integration status"""
    integrations_data = [
        {
            "source_name": "AHRQ SDOH Database",
            "source_type": "api",
            "api_endpoint": "https://api.ahrq.gov/sdoh/v1",
            "sync_status": "success",
            "record_count": 3142,
            "config": {"frequency": "monthly", "enabled": True}
        },
        {
            "source_name": "CDC WONDER",
            "source_type": "api",
            "api_endpoint": "https://wonder.cdc.gov/api/v1",
            "sync_status": "success",
            "record_count": 2890,
            "config": {"frequency": "quarterly", "enabled": True}
        },
        {
            "source_name": "CMS Medicare Data",
            "source_type": "api",
            "api_endpoint": "https://data.cms.gov/api/1/datastore",
            "sync_status": "success",
            "record_count": 15420,
            "config": {"frequency": "monthly", "enabled": True}
        },
        {
            "source_name": "County Health Rankings",
            "source_type": "manual_upload",
            "api_endpoint": None,
            "sync_status": "partial",
            "record_count": 2156,
            "error_log": "Missing data for 8 states",
            "config": {"frequency": "annual", "enabled": True}
        },
        {
            "source_name": "US Census Demographics",
            "source_type": "api",
            "api_endpoint": "https://api.census.gov/data",
            "sync_status": "in_progress",
            "record_count": 8934,
            "config": {"frequency": "annual", "enabled": True}
        },
        {
            "source_name": "UnitedHealthcare Formulary",
            "source_type": "web_scrape",
            "api_endpoint": None,
            "sync_status": "success",
            "record_count": 4521,
            "config": {"frequency": "weekly", "enabled": True}
        },
        {
            "source_name": "Anthem Formulary",
            "source_type": "web_scrape",
            "api_endpoint": None,
            "sync_status": "success",
            "record_count": 3890,
            "config": {"frequency": "weekly", "enabled": True}
        },
        {
            "source_name": "Cigna Formulary",
            "source_type": "web_scrape",
            "api_endpoint": None,
            "sync_status": "success",
            "record_count": 4102,
            "config": {"frequency": "weekly", "enabled": True}
        },
        {
            "source_name": "Aetna Formulary",
            "source_type": "web_scrape",
            "api_endpoint": None,
            "sync_status": "failed",
            "record_count": 0,
            "error_log": "Website structure changed, scraper needs update",
            "config": {"frequency": "weekly", "enabled": True}
        }
    ]

    integrations = []
    for data in integrations_data:
        last_sync = datetime.now() - timedelta(minutes=random.randint(2, 1440))
        integration = DataIntegration(
            source_name=data["source_name"],
            source_type=data["source_type"],
            api_endpoint=data.get("api_endpoint"),
            last_sync=last_sync if data["sync_status"] != "pending" else None,
            sync_status=data["sync_status"],
            record_count=data["record_count"],
            error_log=data.get("error_log"),
            config=data["config"]
        )
        db.add(integration)
        integrations.append(integration)

    db.commit()
    return integrations


def generate_mock_interventions(db: Session, calls):
    """Generate mock interventions for calls with detected triggers"""
    from app.services.trigger_detection import detect_triggers_in_transcript

    interventions = []
    trigger_types_list = [
        "cost_concern", "injection_anxiety", "side_effect_fear",
        "insurance_denial", "access_barrier", "complexity_concern"
    ]
    intervention_types_map = {
        "cost_concern": "copay_enrollment",
        "injection_anxiety": "nurse_callback",
        "side_effect_fear": "educational_material",
        "insurance_denial": "prior_auth_support",
        "access_barrier": "home_delivery",
        "complexity_concern": "educational_material"
    }

    for call in calls:
        if not call.transcript:
            continue

        # Detect triggers in transcript
        triggers = detect_triggers_in_transcript(call.transcript)

        # Create interventions for detected triggers (60% chance of intervention)
        for trigger in triggers[:2]:  # Max 2 interventions per call
            if random.random() < 0.6:
                intervention_applied = random.random() < 0.75  # 75% applied

                # Generate outcome based on intervention
                if intervention_applied:
                    adherence_30 = random.random() < 0.72  # 72% adherence with intervention
                    adherence_90 = random.random() < 0.68  # 68% adherence at 90 days
                    outcome = "patient_retained" if adherence_90 else "patient_abandoned"
                else:
                    adherence_30 = random.random() < 0.48  # 48% without intervention
                    adherence_90 = random.random() < 0.42  # 42% at 90 days
                    outcome = "patient_retained" if adherence_90 else "patient_abandoned"

                intervention = Intervention(
                    call_id=call.id,
                    patient_id=call.patient_id,
                    trigger_type=trigger["trigger_type"],
                    trigger_confidence=trigger["confidence"],
                    trigger_text=trigger.get("context", "")[:500],
                    trigger_timestamp=call.call_date,
                    intervention_type=intervention_types_map.get(trigger["trigger_type"]),
                    intervention_applied=intervention_applied,
                    intervention_timestamp=call.call_date + timedelta(minutes=random.randint(5, 30)) if intervention_applied else None,
                    intervention_notes=f"Applied {intervention_types_map.get(trigger['trigger_type'])} intervention" if intervention_applied else None,
                    outcome_status=outcome,
                    adherence_30_day=adherence_30,
                    adherence_90_day=adherence_90,
                    follow_up_date=call.call_date + timedelta(days=random.randint(7, 30))
                )
                db.add(intervention)
                interventions.append(intervention)

    db.commit()
    return interventions


def generate_mock_adherence_events(db: Session, patients):
    """Generate mock adherence events for patients"""
    events = []
    event_types = ["prescription_fill", "injection_administered", "lab_result", "patient_report", "missed_dose"]

    for patient in patients:
        # Generate 2-5 adherence events per patient over last 90 days
        num_events = random.randint(2, 5)

        for i in range(num_events):
            days_ago = random.randint(0, 90)
            event_date = datetime.now() - timedelta(days=days_ago)
            event_type = random.choice(event_types)

            # Adherent patients have more positive events
            if patient.adherence_score >= 80:
                adherent = event_type != "missed_dose" or random.random() < 0.1
            elif patient.adherence_score >= 60:
                adherent = random.random() < 0.7
            else:
                adherent = random.random() < 0.45

            event_data = {}
            if event_type == "prescription_fill":
                event_data = {"pharmacy": fake.company(), "quantity": random.randint(30, 90)}
            elif event_type == "injection_administered":
                event_data = {"location": random.choice(["home", "clinic"]), "administered_by": random.choice(["self", "nurse"])}
            elif event_type == "lab_result":
                event_data = {"test_type": random.choice(["A1C", "Lipid Panel", "CBC"]), "result": "normal"}

            event = AdherenceEvent(
                patient_id=patient.id,
                event_type=event_type,
                event_date=event_date,
                event_data=event_data,
                medication_name=random.choice(DRUG_NAMES),
                days_supply=random.choice([30, 60, 90]) if event_type == "prescription_fill" else None,
                adherent=adherent,
                notes=fake.sentence() if random.random() < 0.3 else None
            )
            db.add(event)
            events.append(event)

    db.commit()
    return events


def generate_mock_marketing_campaigns(db: Session):
    """Generate mock marketing campaigns"""
    campaigns = []

    campaign_data = [
        {
            "name": "Injection Anxiety Support Campaign",
            "type": "education",
            "theme": "injection_support",
            "segment": {"barriers": ["injection_anxiety"], "risk_level": "medium"},
            "materials": ["How-to video", "Nurse hotline card", "Auto-injector demo"]
        },
        {
            "name": "Copay Assistance Awareness",
            "type": "outreach",
            "theme": "cost_assistance",
            "segment": {"barriers": ["cost"], "insurance_types": ["Commercial", "Medicare"]},
            "materials": ["Copay card", "Savings calculator", "Enrollment form"]
        },
        {
            "name": "At-Risk Patient Retention",
            "type": "retention",
            "theme": "adherence_support",
            "segment": {"journey_stage": "at_risk", "adherence_score": "<60"},
            "materials": ["Personalized call", "Reminder system", "Support group invite"]
        },
        {
            "name": "Side Effect Management Education",
            "type": "education",
            "theme": "side_effect_management",
            "segment": {"barriers": ["side_effect_fear"]},
            "materials": ["Side effect guide", "Pharmacist consult", "24/7 support line"]
        },
        {
            "name": "PA Approval Assistance",
            "type": "awareness",
            "theme": "pa_support",
            "segment": {"journey_stage": "pa_pending"},
            "materials": ["PA tracker", "Doctor office liaison", "Appeal support"]
        }
    ]

    for data in campaign_data:
        start_date = datetime.now() - timedelta(days=random.randint(30, 90))
        end_date = start_date + timedelta(days=random.randint(30, 60)) if random.random() < 0.7 else None

        patients_reached = random.randint(50, 300)
        engagement_rate = random.uniform(0.15, 0.45)  # 15-45% engagement
        conversion_rate = random.uniform(0.05, 0.25)  # 5-25% conversion

        campaign = MarketingCampaign(
            campaign_name=data["name"],
            campaign_type=data["type"],
            start_date=start_date,
            end_date=end_date,
            target_segment=data["segment"],
            message_theme=data["theme"],
            materials_shared=data["materials"],
            patients_reached=patients_reached,
            engagement_rate=engagement_rate,
            conversion_rate=conversion_rate
        )
        db.add(campaign)
        campaigns.append(campaign)

    db.commit()
    return campaigns


def populate_all_mock_data(db: Session):
    """Populate database with comprehensive mock data (500+ patients, 30 days call history)"""
    print("Generating mock patients (500+)...")
    patients = generate_mock_patients(db, count=500)

    print("Generating mock geographic profiles...")
    generate_mock_geographic_profiles(db, count=50)

    print("Generating mock formularies...")
    generate_mock_formularies(db, count=150)

    print("Generating mock assistance programs...")
    programs = generate_mock_assistance_programs(db, count=25)

    print("Generating comprehensive 30-day call history...")
    calls = generate_mock_calls(db, patients, calls_per_patient=3)  # 1500+ calls total

    print("Generating mock enrollments...")
    generate_mock_enrollments(db, patients, programs, calls, count=200)

    print("Generating mock integrations...")
    generate_mock_integrations(db)

    print("Generating mock interventions from call analysis...")
    interventions = generate_mock_interventions(db, calls)

    print("Generating mock adherence events...")
    adherence_events = generate_mock_adherence_events(db, patients)

    print("Generating mock marketing campaigns...")
    campaigns = generate_mock_marketing_campaigns(db)

    print("✓ Mock data generation complete!")
    print(f"  - {len(patients)} patients")
    print(f"  - {len(calls)} calls over 30 days")
    print(f"  - Average {len(calls)/len(patients):.1f} calls per patient")
    print(f"  - {len(interventions)} interventions detected and applied")
    print(f"  - {len(adherence_events)} adherence events tracked")
    print(f"  - {len(campaigns)} marketing campaigns running")
