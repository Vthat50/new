from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from collections import Counter
import re
import os
from pydantic import BaseModel
from openai import OpenAI

from app.core.database import get_db
from app.models import Call, Patient, GeographicProfile
from app.services.trigger_detection import detect_triggers_in_transcript

router = APIRouter()


# Pydantic models for request/response
class WebsiteAnalysisRequest(BaseModel):
    website_contents: List[str]
    total_words: int


class TopicDistribution(BaseModel):
    name: str
    percentage: float


class WebsiteAnalysisResponse(BaseModel):
    topics: List[TopicDistribution]
    total_words: int


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


@router.post("/analyze-marketing-content")
async def analyze_marketing_content(request: WebsiteAnalysisRequest) -> WebsiteAnalysisResponse:
    """
    Analyze marketing website content using OpenAI to determine topic distribution
    """
    try:
        # Get OpenAI API key from environment
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")

        # Initialize OpenAI client
        client = OpenAI(api_key=api_key)

        # Define patient barriers - these are the categories we want OpenAI to analyze
        patient_barriers = [
            {'name': 'Cost & Insurance Support', 'keywords': 'affordability, cost, pricing, insurance, copay, financial assistance, patient assistance programs'},
            {'name': 'Injection Support & Training', 'keywords': 'injection, self-administration, needle anxiety, injection training, how to inject'},
            {'name': 'Side Effects Management', 'keywords': 'side effects, adverse events, safety, tolerability, what to expect'},
            {'name': 'Access & Logistics', 'keywords': 'access, availability, delivery, logistics, pharmacy, specialty pharmacy'},
            {'name': 'Efficacy & Clinical Results', 'keywords': 'efficacy, effectiveness, clinical trials, results, outcomes, benefits'},
            {'name': 'Dosing & Convenience', 'keywords': 'dosing, dosing schedule, convenience, frequency, administration'}
        ]

        # Build the prompt
        prompt = f"""You are analyzing pharmaceutical website content. Determine what percentage of the content focuses on each category below.

CRITICAL INSTRUCTIONS:
1. Read the website content VERY carefully
2. The percentages MUST add up to approximately 100%
3. If a category is not mentioned AT ALL, use 0%
4. Be REALISTIC - don't inflate numbers

CATEGORIES TO ANALYZE:

1. Cost & Insurance Support ({patient_barriers[0]['keywords']})
   - Look for: patient assistance programs, copay cards, financial help, eligibility for assistance, affordability programs, insurance coverage, cost reduction, "cares" programs, application for financial aid
   - If the website is primarily about applying for financial assistance or a patient assistance program, this should be 80-90%

2. Injection Support & Training ({patient_barriers[1]['keywords']})
   - Look for: how to inject, injection techniques, self-administration guides, overcoming fear of needles, injection tutorials

3. Side Effects Management ({patient_barriers[2]['keywords']})
   - Look for: managing side effects, what to expect, adverse events, safety information, dealing with reactions

4. Access & Logistics ({patient_barriers[3]['keywords']})
   - Look for: where to get medication, pharmacy information, delivery, prescription fulfillment

5. Efficacy & Clinical Results ({patient_barriers[4]['keywords']})
   - Look for: how well the drug works, clinical trial data, effectiveness, treatment outcomes, scientific evidence

6. Dosing & Convenience ({patient_barriers[5]['keywords']})
   - Look for: how often to take/inject, dosing schedule, treatment regimen

WEBSITE CONTENT TO ANALYZE:
{chr(10).join(request.website_contents)}

EXAMPLES:
- If website is a patient assistance program (e.g., "LillyCares", "JanssenCares"), use ~85% Cost Support
- If website is about clinical trials/efficacy, use ~60-70% Efficacy
- If website is an injection training portal, use ~70-80% Injection Support

Return ONLY valid JSON (no other text):
{{
  "topics": [
    {{"name": "Cost & Insurance Support", "percentage": 85}},
    {{"name": "Injection Support & Training", "percentage": 0}},
    {{"name": "Side Effects Management", "percentage": 5}},
    {{"name": "Access & Logistics", "percentage": 10}},
    {{"name": "Efficacy & Clinical Results", "percentage": 0}},
    {{"name": "Dosing & Convenience", "percentage": 0}}
  ],
  "total_words": {request.total_words}
}}"""

        # Call OpenAI API
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a marketing analyst that helps pharmaceutical companies understand how well their marketing aligns with patient needs. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        # Parse response
        response_text = completion.choices[0].message.content
        if not response_text:
            raise HTTPException(status_code=500, detail="Empty response from OpenAI")

        import json
        analysis_data = json.loads(response_text)

        # Convert to response model
        topics = [
            TopicDistribution(name=topic["name"], percentage=topic["percentage"])
            for topic in analysis_data.get("topics", [])
        ]

        return WebsiteAnalysisResponse(
            topics=topics,
            total_words=analysis_data.get("total_words", request.total_words)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing content: {str(e)}")


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
