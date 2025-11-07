import React from 'react';
import {
  Users,
  Phone,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  MapPin,
  ArrowRight,
  PhoneOutgoing,
  AlertTriangle,
  FileText,
  Calendar,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
  demoMode?: boolean;
}

export default function DashboardTab({ onNavigate, demoMode = false }: DashboardTabProps) {
  // Executive Summary Metrics
  const summaryMetrics = [
    {
      id: 'active-patients',
      label: 'Active Patient Count',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: colors.primary[500],
      bgColor: colors.primary[50],
      description: '30-day active count',
      targetTab: 'patients',
    },
    {
      id: 'interactions',
      label: "Today's Interactions",
      value: '234',
      change: '+8%',
      trend: 'up',
      icon: Phone,
      color: colors.status.success,
      bgColor: colors.status.successBg,
      description: '156 inbound • 78 outbound',
      subMetric: '94% success rate',
      targetTab: 'conversations',
    },
    {
      id: 'adherence',
      label: 'Adherence Score',
      value: '84%',
      change: '+3%',
      trend: 'up',
      icon: Activity,
      color: colors.status.success,
      bgColor: colors.status.successBg,
      description: 'Week-over-week',
      targetTab: 'analytics',
    },
    {
      id: 'savings',
      label: 'Cost Savings This Month',
      value: '$47.2K',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: colors.primary[500],
      bgColor: colors.primary[50],
      description: 'Reduced call center costs',
      subMetric: '312% ROI',
      targetTab: 'analytics',
    },
  ];

  // Live activity sample data
  const liveActivities = [
    {
      id: 1,
      patientName: 'Sarah M.',
      region: 'California',
      reason: 'Prior Authorization Update',
      sentiment: 'positive',
      duration: '3:24',
    },
    {
      id: 2,
      patientName: 'Michael R.',
      region: 'Texas',
      reason: 'Refill Request',
      sentiment: 'neutral',
      duration: '1:56',
    },
    {
      id: 3,
      patientName: 'Jennifer K.',
      region: 'New York',
      reason: 'Financial Assistance',
      sentiment: 'positive',
      duration: '5:12',
    },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return colors.status.success;
      case 'neutral':
        return colors.status.warning;
      case 'negative':
        return colors.status.error;
      default:
        return colors.neutral[500];
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    return sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
  };

  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.background.page, display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
      {/* Header */}
      <div>
        <h1 className="text-neutral-900" style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
          Dashboard
        </h1>
        <p className="text-neutral-500" style={{ fontSize: typography.fontSize.sm }}>
          Welcome back! Here's your real-time patient support overview
        </p>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              className="bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
              style={{ padding: spacing[6] }}
              onClick={() => onNavigate(metric.targetTab)}
            >
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
                  {metric.trend === 'up' ? <TrendingUp style={{ width: '16px', height: '16px' }} /> : <TrendingDown style={{ width: '16px', height: '16px' }} />}
                  {metric.change}
                </div>
              </div>
              <div className="text-neutral-500" style={{ fontSize: typography.fontSize.xs, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: spacing[1], fontWeight: typography.fontWeight.medium }}>
                {metric.label}
              </div>
              <div className="text-neutral-900" style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
                {metric.value}
              </div>
              <div className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                {metric.description}
              </div>
              {metric.subMetric && (
                <div className="text-primary-600" style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, marginTop: spacing[1] }}>
                  {metric.subMetric}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Activity Monitor and Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Monitor */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-lg" style={{ padding: spacing[6] }}>
          <div className="flex items-center justify-between" style={{ marginBottom: spacing[4] }}>
            <div>
              <h2 className="text-neutral-900" style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                Live Activity Monitor
              </h2>
              <p className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                {liveActivities.length} active conversations
              </p>
            </div>
            <button
              onClick={() => onNavigate('conversations')}
              className="text-primary-600 hover:text-primary-700 transition-colors"
              style={{ fontSize: typography.fontSize.sm, display: 'flex', alignItems: 'center', gap: spacing[1] }}
            >
              View All <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          {/* Live call cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {liveActivities.map((activity) => (
              <div
                key={activity.id}
                className="border border-neutral-200 rounded-md hover:border-primary-300 transition-colors"
                style={{ padding: spacing[4] }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start" style={{ gap: spacing[3], flex: 1 }}>
                    <div className="relative">
                      <div
                        className="rounded-full flex items-center justify-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: colors.primary[50],
                        }}
                      >
                        <Phone style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
                      </div>
                      {/* Pulsing dot animation */}
                      <div
                        className="absolute -top-1 -right-1 rounded-full animate-pulse"
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: colors.status.success,
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: spacing[1] }}>
                        <span className="text-neutral-900" style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
                          {activity.patientName}
                        </span>
                        <span className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                          {activity.duration}
                        </span>
                      </div>
                      <div className="flex items-center" style={{ gap: spacing[4], marginBottom: spacing[2] }}>
                        <div className="flex items-center" style={{ gap: spacing[1] }}>
                          <MapPin style={{ width: '14px', height: '14px', color: colors.neutral[400] }} />
                          <span className="text-neutral-600" style={{ fontSize: typography.fontSize.xs }}>
                            {activity.region}
                          </span>
                        </div>
                        <span className="text-neutral-600" style={{ fontSize: typography.fontSize.xs }}>
                          {activity.reason}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center" style={{ gap: spacing[2] }}>
                          <div
                            className="rounded-full"
                            style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: getSentimentColor(activity.sentiment)
                            }}
                          />
                          <span className="text-neutral-500" style={{ fontSize: typography.fontSize.xs, textTransform: 'capitalize' }}>
                            {getSentimentLabel(activity.sentiment)} sentiment
                          </span>
                        </div>
                        <button
                          onClick={() => onNavigate('conversations')}
                          className="rounded transition-colors"
                          style={{
                            padding: `${spacing[1]} ${spacing[3]}`,
                            backgroundColor: colors.primary[50],
                            color: colors.primary[600],
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.medium,
                          }}
                        >
                          Listen In
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-1 bg-white border border-neutral-200 rounded-lg" style={{ padding: spacing[6] }}>
          <h2 className="text-neutral-900" style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[4] }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            <button
              onClick={() => onNavigate('conversations')}
              className="w-full border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              style={{ padding: spacing[4], textAlign: 'left' }}
            >
              <div className="flex items-center" style={{ gap: spacing[3] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <PhoneOutgoing style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
                </div>
                <div>
                  <div className="text-neutral-900" style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[1] }}>
                    Initiate Outbound Campaign
                  </div>
                  <div className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                    Start calling patients
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('patients')}
              className="w-full border border-neutral-200 rounded-lg hover:border-warning hover:bg-amber-50 transition-colors"
              style={{ padding: spacing[4], textAlign: 'left' }}
            >
              <div className="flex items-center" style={{ gap: spacing[3] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: colors.status.warningBg,
                  }}
                >
                  <AlertTriangle style={{ width: '20px', height: '20px', color: colors.status.warning }} />
                </div>
                <div>
                  <div className="text-neutral-900" style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[1] }}>
                    View High-Priority Patients
                  </div>
                  <div className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                    23 patients need attention
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className="w-full border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              style={{ padding: spacing[4], textAlign: 'left' }}
            >
              <div className="flex items-center" style={{ gap: spacing[3] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <FileText style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
                </div>
                <div>
                  <div className="text-neutral-900" style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[1] }}>
                    Generate Report
                  </div>
                  <div className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                    Export analytics
                  </div>
                </div>
              </div>
            </button>

            <button
              className="w-full border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              style={{ padding: spacing[4], textAlign: 'left' }}
            >
              <div className="flex items-center" style={{ gap: spacing[3] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Calendar style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
                </div>
                <div>
                  <div className="text-neutral-900" style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[1] }}>
                    Schedule Demo
                  </div>
                  <div className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                    Book a follow-up
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
