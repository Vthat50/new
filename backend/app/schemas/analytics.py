from pydantic import BaseModel
from typing import List, Dict


class KPIMetrics(BaseModel):
    call_volume_today: int
    call_volume_this_month: int
    active_patients: int
    total_enrollments: int
    total_savings: float
    avg_handle_time: float
    first_call_resolution_rate: float


class ProgramPerformance(BaseModel):
    program_type: str
    active_count: int
    total_savings: float
    avg_enrollment_time_days: float


class GeographicDistribution(BaseModel):
    state: str
    patient_count: int
    avg_risk_score: float


class BarrierFrequency(BaseModel):
    barrier: str
    count: int
    percentage: float


class AnalyticsDashboard(BaseModel):
    kpi_metrics: KPIMetrics
    program_performance: List[ProgramPerformance]
    geographic_distribution: List[GeographicDistribution]
    barrier_frequency: List[BarrierFrequency]
    call_volume_trend: List[Dict]  # [{date: '2024-01-01', count: 45}, ...]
