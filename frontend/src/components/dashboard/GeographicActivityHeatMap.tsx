import React, { useState, useMemo } from 'react';
import { MapPin, AlertCircle, TrendingUp, Users, DollarSign, Home, Truck } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface ActiveCall {
  id: string;
  patientName: string;
  patientId: string;
  callReason: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  duration: string;
  transcriptSnippet: string;
  startTime: Date;
  zipCode?: string;
  state?: string;
}

interface LiveActivityHeatMapProps {
  activeCalls: ActiveCall[];
  onJumpToCall: (callId: string) => void;
}

// State-level SDOH and call data
interface StateData {
  code: string;
  name: string;
  callVolume: number;
  sdohScore: number; // 0-100, higher = more barriers
  transportationInsecurity: number;
  healthLiteracy: 'low' | 'medium' | 'high';
  insuranceCoverage: number; // percentage with insurance
  ruralPercentage: number;
  avgWaitTime: number; // days
  topBarriers: string[];
  activePatients: number;
}

export default function GeographicActivityHeatMap({ activeCalls, onJumpToCall }: LiveActivityHeatMapProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'volume' | 'sdoh' | 'barriers'>('volume');

  // Simulated state-level data based on PRD requirements
  const stateData: StateData[] = useMemo(() => [
    {
      code: 'CA',
      name: 'California',
      callVolume: 145,
      sdohScore: 42,
      transportationInsecurity: 35,
      healthLiteracy: 'medium',
      insuranceCoverage: 92,
      ruralPercentage: 15,
      avgWaitTime: 12,
      topBarriers: ['Transportation', 'Language Access', 'Cost'],
      activePatients: 423,
    },
    {
      code: 'TX',
      name: 'Texas',
      callVolume: 128,
      sdohScore: 58,
      transportationInsecurity: 45,
      healthLiteracy: 'medium',
      insuranceCoverage: 78,
      ruralPercentage: 35,
      avgWaitTime: 18,
      topBarriers: ['Insurance Coverage', 'Transportation', 'Rural Access'],
      activePatients: 389,
    },
    {
      code: 'FL',
      name: 'Florida',
      callVolume: 112,
      sdohScore: 48,
      transportationInsecurity: 38,
      healthLiteracy: 'medium',
      insuranceCoverage: 82,
      ruralPercentage: 22,
      avgWaitTime: 15,
      topBarriers: ['Cost', 'Transportation', 'Wait Times'],
      activePatients: 356,
    },
    {
      code: 'NY',
      name: 'New York',
      callVolume: 98,
      sdohScore: 38,
      transportationInsecurity: 28,
      healthLiteracy: 'high',
      insuranceCoverage: 95,
      ruralPercentage: 12,
      avgWaitTime: 10,
      topBarriers: ['Cost', 'Wait Times'],
      activePatients: 312,
    },
    {
      code: 'PA',
      name: 'Pennsylvania',
      callVolume: 87,
      sdohScore: 52,
      transportationInsecurity: 42,
      healthLiteracy: 'medium',
      insuranceCoverage: 88,
      ruralPercentage: 28,
      avgWaitTime: 14,
      topBarriers: ['Transportation', 'Rural Access', 'Cost'],
      activePatients: 267,
    },
    {
      code: 'IL',
      name: 'Illinois',
      callVolume: 76,
      sdohScore: 45,
      transportationInsecurity: 36,
      healthLiteracy: 'medium',
      insuranceCoverage: 90,
      ruralPercentage: 18,
      avgWaitTime: 13,
      topBarriers: ['Cost', 'Transportation'],
      activePatients: 234,
    },
    {
      code: 'OH',
      name: 'Ohio',
      callVolume: 72,
      sdohScore: 54,
      transportationInsecurity: 48,
      healthLiteracy: 'medium',
      insuranceCoverage: 86,
      ruralPercentage: 32,
      avgWaitTime: 16,
      topBarriers: ['Transportation', 'Rural Access', 'Health Literacy'],
      activePatients: 223,
    },
    {
      code: 'GA',
      name: 'Georgia',
      callVolume: 68,
      sdohScore: 62,
      transportationInsecurity: 52,
      healthLiteracy: 'low',
      insuranceCoverage: 75,
      ruralPercentage: 38,
      avgWaitTime: 20,
      topBarriers: ['Insurance Coverage', 'Transportation', 'Health Literacy'],
      activePatients: 198,
    },
    {
      code: 'NC',
      name: 'North Carolina',
      callVolume: 64,
      sdohScore: 56,
      transportationInsecurity: 46,
      healthLiteracy: 'medium',
      insuranceCoverage: 82,
      ruralPercentage: 34,
      avgWaitTime: 17,
      topBarriers: ['Rural Access', 'Transportation', 'Cost'],
      activePatients: 189,
    },
    {
      code: 'MI',
      name: 'Michigan',
      callVolume: 61,
      sdohScore: 50,
      transportationInsecurity: 40,
      healthLiteracy: 'medium',
      insuranceCoverage: 89,
      ruralPercentage: 25,
      avgWaitTime: 14,
      topBarriers: ['Transportation', 'Cost'],
      activePatients: 176,
    },
    {
      code: 'AZ',
      name: 'Arizona',
      callVolume: 55,
      sdohScore: 60,
      transportationInsecurity: 50,
      healthLiteracy: 'low',
      insuranceCoverage: 80,
      ruralPercentage: 42,
      avgWaitTime: 19,
      topBarriers: ['Rural Access', 'Transportation', 'Health Literacy'],
      activePatients: 167,
    },
    {
      code: 'WA',
      name: 'Washington',
      callVolume: 52,
      sdohScore: 36,
      transportationInsecurity: 30,
      healthLiteracy: 'high',
      insuranceCoverage: 94,
      ruralPercentage: 20,
      avgWaitTime: 11,
      topBarriers: ['Cost', 'Rural Access'],
      activePatients: 158,
    },
  ], []);

  const getHeatColor = (value: number, max: number, mode: 'volume' | 'sdoh' | 'barriers') => {
    const intensity = value / max;

    if (mode === 'volume') {
      // Green gradient for call volume (good = more engagement)
      if (intensity === 0) return colors.neutral[100];
      if (intensity < 0.25) return '#d1f4e0';
      if (intensity < 0.5) return '#7ee3b0';
      if (intensity < 0.75) return '#2fc97a';
      return '#0ea55c';
    } else {
      // Red gradient for SDOH barriers (red = more barriers = needs attention)
      if (intensity === 0) return colors.neutral[100];
      if (intensity < 0.25) return '#fef3c7'; // light yellow
      if (intensity < 0.5) return '#fbbf24'; // yellow
      if (intensity < 0.75) return '#f97316'; // orange
      return '#dc2626'; // red
    }
  };

  const maxCallVolume = Math.max(...stateData.map(s => s.callVolume));
  const maxSDOH = Math.max(...stateData.map(s => s.sdohScore));

  const selectedStateData = selectedState ? stateData.find(s => s.code === selectedState) : null;

  // Summary statistics
  const totalCalls = stateData.reduce((sum, s) => sum + s.callVolume, 0);
  const avgSDOH = stateData.reduce((sum, s) => sum + s.sdohScore, 0) / stateData.length;
  const highRiskStates = stateData.filter(s => s.sdohScore > 55).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
      {/* Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing[4] }}>
        <div
          style={{
            backgroundColor: 'white',
            padding: spacing[5],
            borderRadius: '12px',
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: colors.primary[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin style={{ width: '24px', height: '24px', color: colors.primary[600] }} />
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Geographic Coverage
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
                {stateData.length} States
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: spacing[5],
            borderRadius: '12px',
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: colors.status.warningBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertCircle style={{ width: '24px', height: '24px', color: colors.status.warning }} />
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Avg SDOH Barrier Score
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
                {avgSDOH.toFixed(0)}/100
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: spacing[5],
            borderRadius: '12px',
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: colors.status.errorBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp style={{ width: '24px', height: '24px', color: colors.status.error }} />
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                High-Risk Regions
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.status.error }}>
                {highRiskStates}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: spacing[5],
            borderRadius: '12px',
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: colors.status.successBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users style={{ width: '24px', height: '24px', color: colors.status.success }} />
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Total Calls Today
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
                {totalCalls}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heat Map Card */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: `1px solid ${colors.neutral[200]}`,
          padding: spacing[6],
        }}
      >
        {/* Header with view toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[6], flexWrap: 'wrap', gap: spacing[4] }}>
          <div>
            <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900], marginBottom: spacing[2] }}>
              Geographic Health Intelligence Heat Map
            </h3>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500] }}>
              {viewMode === 'volume'
                ? 'Call volume by state - darker green indicates higher engagement'
                : 'SDOH barrier intensity by state - red indicates high-barrier regions requiring targeted support'
              }
            </p>
          </div>

          <div style={{ display: 'flex', gap: spacing[2], backgroundColor: colors.neutral[100], borderRadius: '8px', padding: spacing[1] }}>
            <button
              onClick={() => setViewMode('volume')}
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'volume' ? 'white' : 'transparent',
                color: viewMode === 'volume' ? colors.primary[600] : colors.neutral[600],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: viewMode === 'volume' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Call Volume
            </button>
            <button
              onClick={() => setViewMode('sdoh')}
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'sdoh' ? 'white' : 'transparent',
                color: viewMode === 'sdoh' ? colors.status.warning : colors.neutral[600],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: viewMode === 'sdoh' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              SDOH Barriers
            </button>
          </div>
        </div>

        {/* State Grid - GitHub-style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: spacing[3], marginBottom: spacing[6] }}>
          {stateData.map((state) => {
            const isSelected = selectedState === state.code;
            const value = viewMode === 'volume' ? state.callVolume : state.sdohScore;
            const max = viewMode === 'volume' ? maxCallVolume : maxSDOH;

            return (
              <div
                key={state.code}
                onClick={() => setSelectedState(isSelected ? null : state.code)}
                style={{
                  padding: spacing[4],
                  borderRadius: '12px',
                  backgroundColor: getHeatColor(value, max, viewMode),
                  border: isSelected ? `3px solid ${colors.primary[500]}` : `1px solid ${colors.neutral[200]}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.neutral[900], marginBottom: spacing[1] }}>
                  {state.code}
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[2] }}>
                  {state.name}
                </div>
                <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                  {viewMode === 'volume' ? `${state.callVolume} calls` : `${state.sdohScore} SDOH`}
                </div>
                {state.sdohScore > 55 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: spacing[2],
                      right: spacing[2],
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: colors.status.error,
                    }}
                    title="High-risk region"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4], justifyContent: 'center', paddingTop: spacing[4], borderTop: `1px solid ${colors.neutral[200]}` }}>
          <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
            {viewMode === 'volume' ? 'Less Calls' : 'Fewer Barriers'}
          </span>
          <div style={{ display: 'flex', gap: spacing[1] }}>
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, idx) => {
              const max = viewMode === 'volume' ? maxCallVolume : maxSDOH;
              return (
                <div
                  key={idx}
                  style={{
                    width: '32px',
                    height: '20px',
                    backgroundColor: getHeatColor(intensity * max, max, viewMode),
                    borderRadius: '4px',
                    border: `1px solid ${colors.neutral[200]}`,
                  }}
                />
              );
            })}
          </div>
          <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
            {viewMode === 'volume' ? 'More Calls' : 'More Barriers'}
          </span>
        </div>
      </div>

      {/* Selected State Details */}
      {selectedStateData && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `2px solid ${colors.primary[500]}`,
            padding: spacing[6],
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: spacing[6] }}>
            <div>
              <h3 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.neutral[900], marginBottom: spacing[2] }}>
                {selectedStateData.name} ({selectedStateData.code})
              </h3>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500] }}>
                Geographic health intelligence and SDOH barriers
              </p>
            </div>
            <button
              onClick={() => setSelectedState(null)}
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                borderRadius: '8px',
                border: `1px solid ${colors.neutral[300]}`,
                backgroundColor: 'white',
                color: colors.neutral[600],
                fontSize: typography.fontSize.sm,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing[4], marginBottom: spacing[6] }}>
            <div style={{ padding: spacing[4], backgroundColor: colors.primary[50], borderRadius: '8px' }}>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
                Call Volume
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.primary[600] }}>
                {selectedStateData.callVolume}
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
                {selectedStateData.activePatients} active patients
              </div>
            </div>

            <div style={{ padding: spacing[4], backgroundColor: colors.status.warningBg, borderRadius: '8px' }}>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
                SDOH Barrier Score
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.status.warning }}>
                {selectedStateData.sdohScore}/100
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
                {selectedStateData.sdohScore > 55 ? 'High-risk region' : 'Moderate risk'}
              </div>
            </div>

            <div style={{ padding: spacing[4], backgroundColor: colors.neutral[50], borderRadius: '8px' }}>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
                Insurance Coverage
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
                {selectedStateData.insuranceCoverage}%
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
                {selectedStateData.ruralPercentage}% rural population
              </div>
            </div>

            <div style={{ padding: spacing[4], backgroundColor: colors.neutral[50], borderRadius: '8px' }}>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
                Avg Wait Time
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
                {selectedStateData.avgWaitTime} days
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
                Access to care metric
              </div>
            </div>
          </div>

          {/* Top Barriers */}
          <div style={{ marginBottom: spacing[6] }}>
            <h4 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900], marginBottom: spacing[3] }}>
              Top SDOH Barriers
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
              {selectedStateData.topBarriers.map((barrier, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: `${spacing[2]} ${spacing[4]}`,
                    backgroundColor: colors.status.errorBg,
                    color: colors.status.error,
                    borderRadius: '20px',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                  }}
                >
                  {barrier}
                </div>
              ))}
            </div>
          </div>

          {/* AI-Driven Interventions */}
          <div>
            <h4 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900], marginBottom: spacing[3] }}>
              AI-Driven Interventions for This Region
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              {selectedStateData.transportationInsecurity > 40 && (
                <div style={{ display: 'flex', gap: spacing[3], padding: spacing[3], backgroundColor: colors.status.successBg, borderRadius: '8px' }}>
                  <Truck style={{ width: '20px', height: '20px', color: colors.status.success, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                      Home Delivery Priority
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                      High transportation insecurity ({selectedStateData.transportationInsecurity}%) - Voice AI proactively offers home delivery options
                    </div>
                  </div>
                </div>
              )}

              {selectedStateData.healthLiteracy === 'low' && (
                <div style={{ display: 'flex', gap: spacing[3], padding: spacing[3], backgroundColor: colors.primary[50], borderRadius: '8px' }}>
                  <AlertCircle style={{ width: '20px', height: '20px', color: colors.primary[600], flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                      Simplified Communication
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                      Low health literacy region - AI simplifies instructions and schedules follow-up calls
                    </div>
                  </div>
                </div>
              )}

              {selectedStateData.insuranceCoverage < 85 && (
                <div style={{ display: 'flex', gap: spacing[3], padding: spacing[3], backgroundColor: colors.status.warningBg, borderRadius: '8px' }}>
                  <DollarSign style={{ width: '20px', height: '20px', color: colors.status.warning, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                      Copay Assistance Optimization
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                      Below-average insurance coverage ({selectedStateData.insuranceCoverage}%) - AI identifies patients for copay assistance enrollment
                    </div>
                  </div>
                </div>
              )}

              {selectedStateData.ruralPercentage > 30 && (
                <div style={{ display: 'flex', gap: spacing[3], padding: spacing[3], backgroundColor: colors.neutral[50], borderRadius: '8px', border: `1px solid ${colors.neutral[200]}` }}>
                  <Home style={{ width: '20px', height: '20px', color: colors.neutral[600], flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                      Telehealth Prioritization
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                      High rural population ({selectedStateData.ruralPercentage}%) - AI directs patients to telehealth options for better access
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
