from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from collections import Counter
import re

from app.core.database import get_db
from app.models import Call, Patient, GeographicProfile
from app.services.trigger_detection import detect_triggers_in_transcript

router = APIRouter()


def extract_keywords_from_transcripts(transcripts: List[str], min_length: int = 4) -> Dict[str, int]:
    """Extract and count keywords from transcripts"""
    # Common words to exclude
    stop_words = {
        'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'has',
        'will', 'can', 'about', 'just', 'like', 'know', 'what', 'when', 'where',
        'would', 'could', 'should', 'your', 'you', 'are', 'was', 'were', 'been',
        'being', 'they', 'them', 'their', 'there', 'here', 'than', 'then', 'these',
        'those', 'said', 'says', 'okay', 'yeah', 'yes', 'well', 'want', 'need'
    }

    all_words = []
    for transcript in transcripts:
        # Extract words
        words = re.findall(r'\b[a-z]{' + str(min_length) + r',}\b', transcript.lower())
        all_words.extend([w for w in words if w not in stop_words])

    # Count occurrences
    word_counts = Counter(all_words)

    # Return top 100
    return dict(word_counts.most_common(100))


@router.get("/patient-voice-themes")
def get_patient_voice_themes(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    min_frequency: int = 3,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Extract patient voice themes from call transcripts for word cloud visualization
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

    # Get calls with transcripts
    calls = db.query(Call).filter(
        Call.call_date >= start,
        Call.call_date <= end,
        Call.transcript.isnot(None)
    ).all()

    transcripts = [call.transcript for call in calls if call.transcript]

    # Extract keywords
    keywords = extract_keywords_from_transcripts(transcripts)

    # Filter by minimum frequency
    filtered_keywords = {
        word: count for word, count in keywords.items()
        if count >= min_frequency
    }

    # Categorize keywords by theme
    themes = {
        "cost": ["cost", "price", "afford", "expensive", "copay", "payment", "insurance", "coverage", "deductible"],
        "access": ["pharmacy", "delivery", "access", "available", "location", "transportation", "travel"],
        "medical": ["injection", "medication", "dose", "treatment", "therapy", "prescription", "doctor", "nurse"],
        "concerns": ["worried", "concerned", "afraid", "scared", "anxiety", "nervous", "side", "effect", "reaction"],
        "support": ["help", "support", "assistance", "program", "enroll", "eligibility", "qualify"],
    }

    categorized = {}
    for theme, theme_words in themes.items():
        categorized[theme] = {}
        for word in theme_words:
            if word in filtered_keywords:
                categorized[theme][word] = filtered_keywords[word]

    return {
        "date_range": {
            "start": start.isoformat(),
            "end": end.isoformat(),
        },
        "total_calls_analyzed": len(calls),
        "total_keywords": len(filtered_keywords),
        "top_keywords": dict(sorted(filtered_keywords.items(), key=lambda x: x[1], reverse=True)[:50]),
        "categorized_themes": categorized,
    }


@router.get("/barrier-trends")
def get_barrier_trends(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    interval: str = "week",
    db: Session = Depends(get_db)
) -> Dict:
    """
    Get trending data on barriers over time
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

    # Get all calls
    calls = db.query(Call).filter(
        Call.call_date >= start,
        Call.call_date <= end,
        Call.transcript.isnot(None)
    ).order_by(Call.call_date).all()

    # Group by time interval
    if interval == "day":
        delta = timedelta(days=1)
    elif interval == "week":
        delta = timedelta(weeks=1)
    else:  # month
        delta = timedelta(days=30)

    # Create time buckets
    time_series = {}
    current = start
    while current <= end:
        time_series[current.isoformat()] = {
            "cost_concern": 0,
            "injection_anxiety": 0,
            "side_effect_fear": 0,
            "insurance_denial": 0,
            "access_barrier": 0,
            "complexity_concern": 0,
            "total_calls": 0,
        }
        current += delta

    # Analyze calls and bin by time
    for call in calls:
        if not call.call_date or not call.transcript:
            continue

        # Find appropriate time bucket
        bucket_date = start
        while bucket_date <= call.call_date:
            next_bucket = bucket_date + delta
            if call.call_date < next_bucket:
                break
            bucket_date = next_bucket

        bucket_key = bucket_date.isoformat()
        if bucket_key in time_series:
            time_series[bucket_key]["total_calls"] += 1

            # Detect triggers
            triggers = detect_triggers_in_transcript(call.transcript)
            for trigger in triggers:
                trigger_type = trigger["trigger_type"]
                if trigger_type in time_series[bucket_key]:
                    time_series[bucket_key][trigger_type] += 1

    # Convert to list format
    trend_data = [
        {
            "date": date,
            **values
        }
        for date, values in sorted(time_series.items())
    ]

    return {
        "date_range": {
            "start": start.isoformat(),
            "end": end.isoformat(),
        },
        "interval": interval,
        "trend_data": trend_data,
    }


@router.get("/geographic-insights")
def get_geographic_insights(
    db: Session = Depends(get_db)
) -> Dict:
    """
    Get geographic distribution of barriers and abandonment risk
    """
    # Get all patients with their states
    patient_states = db.query(
        Patient.state,
        func.count(Patient.id).label('patient_count'),
        func.avg(Patient.sdoh_risk_score).label('avg_sdoh_risk')
    ).filter(
        Patient.state.isnot(None)
    ).group_by(Patient.state).all()

    # Get calls by state
    state_data = {}
    for state, patient_count, avg_sdoh in patient_states:
        # Get calls for patients in this state
        calls = db.query(Call).join(Patient).filter(
            Patient.state == state,
            Call.transcript.isnot(None)
        ).all()

        # Analyze triggers
        trigger_counts = {
            "cost_concern": 0,
            "injection_anxiety": 0,
            "side_effect_fear": 0,
            "insurance_denial": 0,
        }

        for call in calls:
            if call.transcript:
                triggers = detect_triggers_in_transcript(call.transcript)
                for trigger in triggers:
                    trigger_type = trigger["trigger_type"]
                    if trigger_type in trigger_counts:
                        trigger_counts[trigger_type] += 1

        total_triggers = sum(trigger_counts.values())
        abandonment_rate = (total_triggers / len(calls) * 20) if calls else 0  # Rough estimate

        state_data[state] = {
            "patient_count": patient_count,
            "avg_sdoh_risk": round(float(avg_sdoh) if avg_sdoh else 0, 1),
            "call_count": len(calls),
            "trigger_breakdown": trigger_counts,
            "total_triggers": total_triggers,
            "estimated_abandonment_rate": round(min(abandonment_rate, 100), 1),
        }

    # Identify hotspots (high abandonment areas)
    hotspots = sorted(
        [
            {"state": state, **data}
            for state, data in state_data.items()
            if data["estimated_abandonment_rate"] >= 30
        ],
        key=lambda x: x["estimated_abandonment_rate"],
        reverse=True
    )

    return {
        "state_breakdown": state_data,
        "total_states": len(state_data),
        "hotspots": hotspots[:10],  # Top 10 high-risk states
    }


@router.get("/competitor-mentions")
def get_competitor_mentions(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Extract mentions of competitor drugs from call transcripts
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

    # Common competitor drugs (mock data - would be configurable in production)
    competitors = [
        "humira", "enbrel", "remicade", "stelara", "cosentyx",
        "taltz", "skyrizi", "rinvoq", "xeljanz", "otezla"
    ]

    # Get calls
    calls = db.query(Call).filter(
        Call.call_date >= start,
        Call.call_date <= end,
        Call.transcript.isnot(None)
    ).all()

    competitor_counts = {}
    competitor_contexts = {}

    for competitor in competitors:
        competitor_counts[competitor] = 0
        competitor_contexts[competitor] = []

    # Search transcripts
    for call in calls:
        if not call.transcript:
            continue

        transcript_lower = call.transcript.lower()

        for competitor in competitors:
            if competitor in transcript_lower:
                competitor_counts[competitor] += 1

                # Extract context
                index = transcript_lower.find(competitor)
                start_idx = max(0, index - 75)
                end_idx = min(len(call.transcript), index + len(competitor) + 75)
                context = call.transcript[start_idx:end_idx].strip()

                if len(competitor_contexts[competitor]) < 3:  # Keep up to 3 examples
                    competitor_contexts[competitor].append({
                        "call_id": str(call.id),
                        "context": context,
                        "date": call.call_date.isoformat() if call.call_date else None,
                    })

    # Sort by mention count
    sorted_competitors = sorted(
        [
            {
                "drug_name": comp,
                "mention_count": count,
                "example_contexts": competitor_contexts[comp],
            }
            for comp, count in competitor_counts.items()
            if count > 0
        ],
        key=lambda x: x["mention_count"],
        reverse=True
    )

    return {
        "date_range": {
            "start": start.isoformat(),
            "end": end.isoformat(),
        },
        "total_calls_analyzed": len(calls),
        "competitor_mentions": sorted_competitors,
        "total_mentions": sum(competitor_counts.values()),
    }
