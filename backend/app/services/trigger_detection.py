"""
Trigger detection service for identifying abandonment signals in call transcripts
"""
import re
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
import random


# Trigger patterns with keywords
TRIGGER_PATTERNS = {
    "cost_concern": {
        "keywords": [
            r"\b(can'?t afford|too expensive|cost|price|copay|deductible|out of pocket|payment|financial)",
            r"\b(money|budget|insurance won'?t cover|not covered)",
        ],
        "severity": "high",
    },
    "injection_anxiety": {
        "keywords": [
            r"\b(scared|afraid|fear|anxiety|anxious|nervous|worry|worried)",
            r"\b(needle|injection|shot|self-inject|administer)",
            r"\b(painful|pain|hurt|uncomfortable)",
        ],
        "severity": "medium",
    },
    "side_effect_fear": {
        "keywords": [
            r"\b(side effect|adverse|reaction|complication)",
            r"\b(nausea|vomit|dizzy|tired|fatigue|rash|headache)",
            r"\b(worried about|concerned about|afraid of)",
        ],
        "severity": "medium",
    },
    "insurance_denial": {
        "keywords": [
            r"\b(denied|rejection|not approved|not covered|prior auth)",
            r"\b(insurance denied|claim denied|won'?t approve)",
            r"\b(formulary|not on the list|tier)",
        ],
        "severity": "high",
    },
    "access_barrier": {
        "keywords": [
            r"\b(can'?t get to|no transportation|too far|pharmacy closed)",
            r"\b(delivery|ship|mail order)",
            r"\b(access|available|find it)",
        ],
        "severity": "medium",
    },
    "complexity_concern": {
        "keywords": [
            r"\b(complicated|confusing|don'?t understand|too hard)",
            r"\b(instructions|how do I|help me)",
            r"\b(difficult|struggle|overwhelmed)",
        ],
        "severity": "low",
    },
}


# Intervention recommendations based on triggers
INTERVENTION_RECOMMENDATIONS = {
    "cost_concern": {
        "primary": "copay_enrollment",
        "secondary": ["bridge_program", "patient_assistance"],
        "script": "I understand cost is a concern. Let me enroll you in our copay assistance program right now - it can reduce your cost to $0-$10 per month.",
        "expected_impact": 0.40,  # 40% improvement in adherence
    },
    "injection_anxiety": {
        "primary": "nurse_callback",
        "secondary": ["injection_training_video", "auto_injector"],
        "script": "I can schedule a nurse to call you and walk through the injection process. They can also discuss auto-injector options that make it much easier.",
        "expected_impact": 0.35,  # 35% improvement
    },
    "side_effect_fear": {
        "primary": "educational_material",
        "secondary": ["pharmacist_consult", "nurse_callback"],
        "script": "Let me send you detailed information about what to expect and how to manage any side effects. I can also schedule a pharmacist consultation.",
        "expected_impact": 0.25,  # 25% improvement
    },
    "insurance_denial": {
        "primary": "prior_auth_support",
        "secondary": ["appeal_assistance", "bridge_program"],
        "script": "I'll have our prior authorization team work directly with your doctor's office to get this approved. This usually takes 3-5 days.",
        "expected_impact": 0.45,  # 45% improvement
    },
    "access_barrier": {
        "primary": "home_delivery",
        "secondary": ["pharmacy_locator", "specialty_pharmacy"],
        "script": "I can set up free home delivery for you, so the medication comes directly to your door each month.",
        "expected_impact": 0.30,  # 30% improvement
    },
    "complexity_concern": {
        "primary": "educational_material",
        "secondary": ["nurse_callback", "simplified_instructions"],
        "script": "I'll send you a step-by-step guide with pictures, and we can schedule a nurse to walk through everything with you.",
        "expected_impact": 0.20,  # 20% improvement
    },
}


def detect_triggers_in_transcript(transcript: str) -> List[Dict]:
    """
    Analyze a call transcript and detect abandonment triggers

    Args:
        transcript: The call transcript text

    Returns:
        List of detected triggers with confidence scores
    """
    if not transcript:
        return []

    detected_triggers = []
    transcript_lower = transcript.lower()

    for trigger_type, config in TRIGGER_PATTERNS.items():
        matches = []
        for pattern in config["keywords"]:
            found = re.findall(pattern, transcript_lower, re.IGNORECASE)
            matches.extend(found)

        if matches:
            # Calculate confidence based on number of matches and pattern complexity
            confidence = min(0.6 + (len(matches) * 0.1), 0.99)

            # Extract context around first match
            first_match = matches[0]
            match_index = transcript_lower.find(first_match)
            start = max(0, match_index - 50)
            end = min(len(transcript), match_index + len(first_match) + 50)
            context = transcript[start:end].strip()

            detected_triggers.append({
                "trigger_type": trigger_type,
                "confidence": round(confidence, 2),
                "severity": config["severity"],
                "match_count": len(matches),
                "context": context,
                "keywords_found": list(set(matches))[:5],  # Top 5 unique matches
                "recommendation": INTERVENTION_RECOMMENDATIONS.get(trigger_type, {})
            })

    # Sort by confidence (highest first)
    detected_triggers.sort(key=lambda x: x["confidence"], reverse=True)

    return detected_triggers


def calculate_abandonment_risk(
    triggers: List[Dict],
    patient_history: Dict = None
) -> Tuple[int, str]:
    """
    Calculate abandonment risk score based on detected triggers and patient history

    Args:
        triggers: List of detected triggers
        patient_history: Optional patient historical data

    Returns:
        Tuple of (risk_score, risk_level)
    """
    if not triggers:
        base_risk = 20  # Low baseline risk
    else:
        # Start with trigger-based risk
        high_severity_count = sum(1 for t in triggers if t["severity"] == "high")
        medium_severity_count = sum(1 for t in triggers if t["severity"] == "medium")

        base_risk = (high_severity_count * 25) + (medium_severity_count * 15) + 10

    # Adjust based on patient history if available
    if patient_history:
        if patient_history.get("prior_abandonments", 0) > 0:
            base_risk += 20
        if patient_history.get("missed_appointments", 0) > 2:
            base_risk += 15
        if patient_history.get("sdoh_risk_score", 0) > 70:
            base_risk += 10

    risk_score = min(base_risk, 99)

    # Determine risk level
    if risk_score >= 70:
        risk_level = "high"
    elif risk_score >= 40:
        risk_level = "medium"
    else:
        risk_level = "low"

    return risk_score, risk_level


def generate_intervention_plan(triggers: List[Dict]) -> Dict:
    """
    Generate a recommended intervention plan based on detected triggers

    Args:
        triggers: List of detected triggers

    Returns:
        Intervention plan with prioritized actions
    """
    if not triggers:
        return {
            "priority": "low",
            "actions": [],
            "expected_impact": 0.0,
        }

    # Sort triggers by severity and confidence
    priority_triggers = sorted(
        triggers,
        key=lambda x: (
            {"high": 3, "medium": 2, "low": 1}[x["severity"]],
            x["confidence"]
        ),
        reverse=True
    )

    actions = []
    total_impact = 0.0

    for trigger in priority_triggers[:3]:  # Top 3 triggers
        rec = trigger.get("recommendation", {})
        if rec:
            actions.append({
                "trigger": trigger["trigger_type"],
                "action": rec.get("primary"),
                "alternatives": rec.get("secondary", []),
                "script": rec.get("script"),
                "expected_impact": rec.get("expected_impact", 0.0),
            })
            total_impact += rec.get("expected_impact", 0.0)

    # Determine overall priority
    if any(t["severity"] == "high" for t in priority_triggers[:2]):
        priority = "high"
    elif priority_triggers:
        priority = "medium"
    else:
        priority = "low"

    return {
        "priority": priority,
        "actions": actions,
        "expected_impact": min(total_impact, 0.80),  # Cap at 80%
        "estimated_time_minutes": len(actions) * 3,  # 3 minutes per intervention
    }


def analyze_call_for_triggers(call_data: Dict) -> Dict:
    """
    Complete analysis of a call for triggers and recommendations

    Args:
        call_data: Call data including transcript

    Returns:
        Complete analysis results
    """
    transcript = call_data.get("transcript", "")
    patient_history = call_data.get("patient_history", {})

    # Detect triggers
    triggers = detect_triggers_in_transcript(transcript)

    # Calculate risk
    risk_score, risk_level = calculate_abandonment_risk(triggers, patient_history)

    # Generate intervention plan
    intervention_plan = generate_intervention_plan(triggers)

    return {
        "triggers_detected": triggers,
        "trigger_count": len(triggers),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "intervention_plan": intervention_plan,
        "analysis_timestamp": datetime.utcnow().isoformat(),
    }
