export interface Patient {
  id: string;
  mrn: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  phone?: string;
  email?: string;
  zip_code?: string;
  state?: string;
  insurance_type?: string;
  insurance_plan_id?: string;
  insurance_plan_name?: string;
  sdoh_risk_score: number;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface PatientWithEnrichment extends Patient {
  geographic_profile?: {
    zip_code: string;
    urban_rural: string;
    sdoh_factors: Record<string, number>;
    nearest_pharmacy_miles?: number;
  };
  coverage_info?: {
    plan_name: string;
    tier: number;
    pa_required: boolean;
    estimated_copay?: number;
  };
  eligible_programs?: Array<{
    id: string;
    name: string;
    type: string;
    max_benefit?: number;
  }>;
}

export interface Call {
  id: string;
  patient_id: string;
  audio_file_url?: string;
  transcript?: string;
  duration_seconds?: number;
  call_date: string;
  barriers_identified: string[];
  programs_enrolled: string[];
  actions_taken?: Record<string, any>;
  ai_recommendations?: Record<string, any>;
  call_summary?: string;
  created_at: string;
}

export interface CallAnalysis {
  transcript: string;
  patient_data: Record<string, any>;
  enrichment_data: {
    sdoh: {
      urban_rural: string;
      transportation_score: number;
      health_literacy: number;
      nearest_pharmacy_miles?: number;
    };
    coverage: {
      has_insurance: boolean;
      estimated_copay?: number;
    };
  };
  barriers: string[];
  recommendations: Array<{
    action: string;
    priority: string;
    rationale: string;
    estimated_impact?: string;
    estimated_savings?: number;
  }>;
  call_summary: string;
}

export interface DataIntegration {
  id: string;
  source_name: string;
  source_type: string;
  sync_status: string;
  last_sync?: string;
  record_count: number;
  error_log?: string;
  config?: Record<string, any>;
}

export interface AnalyticsDashboard {
  kpi_metrics: {
    call_volume_today: number;
    call_volume_this_month: number;
    active_patients: number;
    total_enrollments: number;
    total_savings: number;
    avg_handle_time: number;
    first_call_resolution_rate: number;
  };
  program_performance: Array<{
    program_type: string;
    active_count: number;
    total_savings: number;
    avg_enrollment_time_days: number;
  }>;
  geographic_distribution: Array<{
    state: string;
    patient_count: number;
    avg_risk_score: number;
  }>;
  barrier_frequency: Array<{
    barrier: string;
    count: number;
    percentage: number;
  }>;
  call_volume_trend: Array<{
    date: string;
    count: number;
  }>;
}
