import React, { useState, useEffect } from 'react';
import { colors, spacing, typography } from '../../lib/design-system';
import AnimatedCounter from '../shared/AnimatedCounter';
import Sparkline from '../shared/Sparkline';
import LiveActivityMap from '../dashboard/LiveActivityMap';
import QuickActionsPanel from '../dashboard/QuickActionsPanel';
import CampaignWizard from '../modals/CampaignWizard';
import ReportGenerator from '../modals/ReportGenerator';
import DemoScheduler from '../modals/DemoScheduler';
import { Users, Phone, Activity, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface EnhancedDashboardTabProps {
  onNavigate: (tab: string) => void;
  demoMode?: boolean;
}

export default function EnhancedDashboardTab({ onNavigate, demoMode = false }: EnhancedDashboardTabProps) {
  const [showCampaignWizard, setShowCampaignWizard] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showDemoScheduler, setShowDemoScheduler] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Executive Summary Metrics with sparkline data
  const summaryMetrics = [
    {
      id: 'active-patients',
      label: 'Active Patient Count',
      numericValue: 1247,
      change: '+12%',
      trend: 'up' as const,
      icon: Users,
      color: colors.primary[500],
      bgColor: colors.primary[50],
      description: '30-day active count',
      sparklineData: [1180, 1195, 1210, 1205, 1220, 1235, 1247],
      targetTab: 'patients',
    },
    {
      id: 'interactions',
      label: "Today's Interactions",
      numericValue: 234,
      change: '+8%',
      trend: 'up' as const,
      icon: Phone,
      color: colors.status.success,
      bgColor: colors.status.successBg,
      description: '156 inbound • 78 outbound',
      subMetric: '94% success rate',
      sparklineData: [198, 212, 225, 219, 228, 231, 234],
      targetTab: 'conversations',
    },
    {
      id: 'adherence',
      label: 'Adherence Score',
      numericValue: 84,
      change: '+3%',
      trend: 'up' as const,
      icon: Activity,
      color: colors.status.success,
      bgColor: colors.status.successBg,
      description: 'Week-over-week',
      sparklineData: [78, 79, 81, 82, 82, 83, 84],
      targetTab: 'analytics',
      suffix: '%',
    },
    {
      id: 'savings',
      label: 'Cost Savings This Month',
      numericValue: 47200,
      change: '+18%',
      trend: 'up' as const,
      icon: DollarSign,
      color: colors.primary[500],
      bgColor: colors.primary[50],
      description: 'Reduced call center costs',
      subMetric: '312% ROI',
      sparklineData: [38000, 40000, 42500, 43800, 45200, 46100, 47200],
      targetTab: 'analytics',
      format: 'currency' as const,
    },
  ];

  // Live activity data with geographic coordinates
  const activeCalls = [
    {
      id: 'call-1',
      lat: 34.05,
      lng: -118.25,
      patientName: demoMode ? 'Patient 00123' : 'Sarah M.',
      patientId: 'PT-00123',
      callReason: 'Prior Authorization Update',
      sentiment: 'positive' as const,
      duration: '3:24',
      transcriptSnippet: 'I understand your PA was approved. Let me verify your coverage details',
    },
    {
      id: 'call-2',
      lat: 29.76,
      lng: -95.37,
      patientName: demoMode ? 'Patient 00456' : 'Michael R.',
      patientId: 'PT-00456',
      callReason: 'Refill Request',
      sentiment: 'neutral' as const,
      duration: '1:56',
      transcriptSnippet: 'Yes, I can help you with that refill. What pharmacy do you use',
    },
    {
      id: 'call-3',
      lat: 40.71,
      lng: -74.01,
      patientName: demoMode ? 'Patient 00789' : 'Jennifer K.',
      patientId: 'PT-00789',
      callReason: 'Financial Assistance',
      sentiment: 'positive' as const,
      duration: '5:12',
      transcriptSnippet: 'Great news! You qualify for our copay assistance program',
    },
    {
      id: 'call-4',
      lat: 33.45,
      lng: -112.07,
      patientName: demoMode ? 'Patient 00234' : 'David L.',
      patientId: 'PT-00234',
      callReason: 'Side Effects Inquiry',
      sentiment: 'neutral' as const,
      duration: '4:15',
      transcriptSnippet: 'Tell me more about what you\'re experiencing so I can help',
    },
  ];

  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.background.page, display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
      {/* Header */}
      <div>
        <h1 className="text-neutral-900" style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
          Dashboard
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="text-neutral-500" style={{ fontSize: typography.fontSize.sm }}>
            Welcome back! Here's your real-time patient support overview
          </p>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[400] }}>
            Auto-refreshing every 5s
          </div>
        </div>
      </div>

      {/* Executive Summary Cards with Animated Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;

          return (
            <div
              key={metric.id}
              className="bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
              style={{ padding: spacing[6] }}
              onClick={() => onNavigate(metric.targetTab)}
            >
              {/* Icon and Trend */}
              <div className="flex items-start justify-between" style={{ marginBottom: spacing[3] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: metric.bgColor,
                  }}
                >
                  <Icon style={{ width: '24px', height: '24px', color: metric.color }} />
                </div>
                <div className="flex items-center" style={{ gap: spacing[1], fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: metric.trend === 'up' ? colors.status.success : colors.status.error }}>
                  <TrendIcon style={{ width: '16px', height: '16px' }} />
                  {metric.change}
                </div>
              </div>

              {/* Label */}
              <div className="text-neutral-500" style={{ fontSize: typography.fontSize.xs, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: spacing[1], fontWeight: typography.fontWeight.medium }}>
                {metric.label}
              </div>

              {/* Animated Value */}
              <div className="text-neutral-900" style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
                <AnimatedCounter
                  end={metric.numericValue}
                  duration={2000}
                  format={metric.format || 'number'}
                  suffix={metric.suffix || ''}
                />
              </div>

              {/* Sparkline */}
              <div style={{ marginBottom: spacing[2] }}>
                <Sparkline
                  data={metric.sparklineData}
                  width={200}
                  height={30}
                  color={metric.color}
                  lineWidth={2}
                />
              </div>

              {/* Description */}
              <div className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                {metric.description}
              </div>

              {/* Sub Metric */}
              {metric.subMetric && (
                <div className="text-primary-600" style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, marginTop: spacing[1] }}>
                  {metric.subMetric}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Activity Map */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: `1px solid ${colors.neutral[200]}`, padding: spacing[6] }}>
        <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[4] }}>
          Live Activity Monitor
        </h2>
        <LiveActivityMap
          activeCalls={activeCalls}
          onJumpToCall={(callId) => {
            console.log('Jumping to call:', callId);
            onNavigate('conversations');
          }}
        />
      </div>

      {/* Quick Actions Panel */}
      <QuickActionsPanel
        demoMode={demoMode}
        onInitiateCampaign={() => setShowCampaignWizard(true)}
        onViewHighPriority={() => onNavigate('patients')}
        onGenerateReport={() => setShowReportGenerator(true)}
        onScheduleDemo={() => setShowDemoScheduler(true)}
      />

      {/* Modals */}
      <CampaignWizard
        isOpen={showCampaignWizard}
        onClose={() => setShowCampaignWizard(false)}
        selectedPatientCount={0}
      />

      <ReportGenerator
        isOpen={showReportGenerator}
        onClose={() => setShowReportGenerator(false)}
      />

      <DemoScheduler
        isOpen={showDemoScheduler}
        onClose={() => setShowDemoScheduler(false)}
      />
    </div>
  );
}
