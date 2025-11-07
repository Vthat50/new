from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from app.api.dependencies import get_db
from app.models import Patient, Call, Enrollment, AssistanceProgram
from app.schemas.analytics import (
    AnalyticsDashboard, KPIMetrics, ProgramPerformance,
    GeographicDistribution, BarrierFrequency
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/dashboard", response_model=AnalyticsDashboard)
def get_analytics_dashboard(db: Session = Depends(get_db)):
    """Get complete analytics dashboard data"""

    # KPI Metrics
    today = datetime.now().date()
    month_start = datetime.now().replace(day=1).date()

    call_volume_today = db.query(Call).filter(
        func.date(Call.call_date) == today
    ).count()

    call_volume_this_month = db.query(Call).filter(
        func.date(Call.call_date) >= month_start
    ).count()

    active_patients = db.query(Patient).filter(Patient.status == "active").count()

    total_enrollments = db.query(Enrollment).filter(
        Enrollment.status.in_(["active", "approved"])
    ).count()

    total_savings = db.query(func.sum(Enrollment.estimated_savings)).filter(
        Enrollment.status.in_(["active", "approved"])
    ).scalar() or 0

    avg_call_duration = db.query(func.avg(Call.duration_seconds)).scalar() or 0

    # First call resolution (mock calculation)
    total_calls = db.query(Call).count()
    first_call_resolution_rate = 0.87  # Mock value

    kpi_metrics = KPIMetrics(
        call_volume_today=call_volume_today,
        call_volume_this_month=call_volume_this_month,
        active_patients=active_patients,
        total_enrollments=total_enrollments,
        total_savings=float(total_savings),
        avg_handle_time=float(avg_call_duration),
        first_call_resolution_rate=first_call_resolution_rate
    )

    # Program Performance
    program_stats = db.query(
        AssistanceProgram.program_type,
        func.count(Enrollment.id).label("count"),
        func.sum(Enrollment.estimated_savings).label("savings")
    ).join(
        Enrollment, Enrollment.program_id == AssistanceProgram.id
    ).filter(
        Enrollment.status.in_(["active", "approved"])
    ).group_by(
        AssistanceProgram.program_type
    ).all()

    program_performance = [
        ProgramPerformance(
            program_type=stat.program_type,
            active_count=stat.count,
            total_savings=float(stat.savings) if stat.savings else 0,
            avg_enrollment_time_days=5.2  # Mock value
        )
        for stat in program_stats
    ]

    # Geographic Distribution
    geo_stats = db.query(
        Patient.state,
        func.count(Patient.id).label("count"),
        func.avg(Patient.sdoh_risk_score).label("avg_risk")
    ).filter(
        Patient.state.isnot(None)
    ).group_by(
        Patient.state
    ).all()

    geographic_distribution = [
        GeographicDistribution(
            state=stat.state,
            patient_count=stat.count,
            avg_risk_score=float(stat.avg_risk) if stat.avg_risk else 0
        )
        for stat in geo_stats
    ]

    # Barrier Frequency
    # This is a simplified query - in production would use array aggregation
    barriers_data = {}
    all_calls = db.query(Call).filter(Call.barriers_identified.isnot(None)).all()

    for call in all_calls:
        if call.barriers_identified:
            for barrier in call.barriers_identified:
                barriers_data[barrier] = barriers_data.get(barrier, 0) + 1

    total_barriers = sum(barriers_data.values()) or 1
    barrier_frequency = [
        BarrierFrequency(
            barrier=barrier,
            count=count,
            percentage=round((count / total_barriers) * 100, 1)
        )
        for barrier, count in sorted(barriers_data.items(), key=lambda x: x[1], reverse=True)
    ]

    # Call Volume Trend (last 30 days)
    call_volume_trend = []
    for i in range(30, -1, -1):
        date = datetime.now() - timedelta(days=i)
        count = db.query(Call).filter(
            func.date(Call.call_date) == date.date()
        ).count()
        call_volume_trend.append({
            "date": date.strftime("%Y-%m-%d"),
            "count": count
        })

    return AnalyticsDashboard(
        kpi_metrics=kpi_metrics,
        program_performance=program_performance,
        geographic_distribution=geographic_distribution,
        barrier_frequency=barrier_frequency,
        call_volume_trend=call_volume_trend
    )


@router.get("/kpi")
def get_kpi_metrics(db: Session = Depends(get_db)):
    """Get just KPI metrics for real-time updates"""
    today = datetime.now().date()

    return {
        "active_calls": 0,  # Would track websocket connections in production
        "queue_length": 0,
        "calls_today": db.query(Call).filter(func.date(Call.call_date) == today).count(),
        "enrollments_today": db.query(Enrollment).filter(func.date(Enrollment.enrollment_date) == today).count()
    }
