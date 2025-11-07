import React, { useState } from 'react';
import { Plus, BarChart3, PieChart, TrendingUp, Users, Clock, Activity, DollarSign, Target } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'engagement' | 'revenue' | 'operations';
  icon: React.ReactNode;
  previewImage?: string;
  config: any;
}

interface WidgetLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (widget: WidgetTemplate) => void;
}

const widgetTemplates: WidgetTemplate[] = [
  {
    id: 'call-volume',
    name: 'Call Volume Trend',
    description: 'Track daily call volume over time',
    category: 'performance',
    icon: <Activity style={{ width: '20px', height: '20px' }} />,
    config: { type: 'line', metric: 'calls' },
  },
  {
    id: 'sentiment-distribution',
    name: 'Sentiment Distribution',
    description: 'Breakdown of call sentiments',
    category: 'engagement',
    icon: <PieChart style={{ width: '20px', height: '20px' }} />,
    config: { type: 'donut', metric: 'sentiment' },
  },
  {
    id: 'conversion-rate',
    name: 'Conversion Rate',
    description: 'Track conversion metrics',
    category: 'performance',
    icon: <TrendingUp style={{ width: '20px', height: '20px' }} />,
    config: { type: 'gauge', metric: 'conversion' },
  },
  {
    id: 'active-users',
    name: 'Active Patients',
    description: 'Number of active patients',
    category: 'engagement',
    icon: <Users style={{ width: '20px', height: '20px' }} />,
    config: { type: 'number', metric: 'active_patients' },
  },
  {
    id: 'avg-duration',
    name: 'Average Call Duration',
    description: 'Mean call duration over time',
    category: 'operations',
    icon: <Clock style={{ width: '20px', height: '20px' }} />,
    config: { type: 'line', metric: 'duration' },
  },
  {
    id: 'revenue-trend',
    name: 'Revenue Impact',
    description: 'Revenue generated from calls',
    category: 'revenue',
    icon: <DollarSign style={{ width: '20px', height: '20px' }} />,
    config: { type: 'bar', metric: 'revenue' },
  },
  {
    id: 'fcr-rate',
    name: 'First Call Resolution',
    description: 'FCR percentage',
    category: 'performance',
    icon: <Target style={{ width: '20px', height: '20px' }} />,
    config: { type: 'donut', metric: 'fcr' },
  },
  {
    id: 'top-topics',
    name: 'Top Call Topics',
    description: 'Most discussed topics',
    category: 'engagement',
    icon: <BarChart3 style={{ width: '20px', height: '20px' }} />,
    config: { type: 'bar', metric: 'topics' },
  },
  {
    id: 'response-time',
    name: 'Response Time',
    description: 'Average response time gauge',
    category: 'operations',
    icon: <Clock style={{ width: '20px', height: '20px' }} />,
    config: { type: 'gauge', metric: 'response_time' },
  },
  {
    id: 'leaderboard',
    name: 'Agent Leaderboard',
    description: 'Top performing agents',
    category: 'performance',
    icon: <Users style={{ width: '20px', height: '20px' }} />,
    config: { type: 'leaderboard', metric: 'agent_performance' },
  },
];

export default function WidgetLibrary({ isOpen, onClose, onAddWidget }: WidgetLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Widgets' },
    { id: 'performance', label: 'Performance' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'operations', label: 'Operations' },
  ];

  const filteredWidgets = widgetTemplates.filter((widget) => {
    const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
        }}
      />

      {/* Slide Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '500px',
          backgroundColor: 'white',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.2)',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: spacing[6],
            borderBottom: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <h2
            style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              marginBottom: spacing[2],
            }}
          >
            Widget Library
          </h2>
          <p
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600],
            }}
          >
            Add widgets to your dashboard
          </p>
        </div>

        {/* Search */}
        <div style={{ padding: spacing[4], borderBottom: `1px solid ${colors.neutral[200]}` }}>
          <input
            type="text"
            placeholder="Search widgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: spacing[3],
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
            }}
          />
        </div>

        {/* Category Tabs */}
        <div
          style={{
            padding: spacing[4],
            borderBottom: `1px solid ${colors.neutral[200]}`,
            display: 'flex',
            gap: spacing[2],
            overflowX: 'auto',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: `${spacing[2]} ${spacing[3]}`,
                backgroundColor: selectedCategory === cat.id ? colors.primary[500] : 'white',
                color: selectedCategory === cat.id ? 'white' : colors.neutral[700],
                border: `1px solid ${selectedCategory === cat.id ? colors.primary[500] : colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Widget List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: spacing[4],
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {filteredWidgets.map((widget) => (
              <div
                key={widget.id}
                style={{
                  padding: spacing[4],
                  border: `1px solid ${colors.neutral[200]}`,
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  transition: 'all 0.2s',
                }}
                className="widget-card"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[3] }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      backgroundColor: colors.primary[50],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.primary[600],
                      flexShrink: 0,
                    }}
                  >
                    {widget.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: typography.fontSize.md,
                        fontWeight: typography.fontWeight.semibold,
                        marginBottom: spacing[1],
                      }}
                    >
                      {widget.name}
                    </h3>
                    <p
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[600],
                        marginBottom: spacing[3],
                      }}
                    >
                      {widget.description}
                    </p>

                    <button
                      onClick={() => {
                        onAddWidget(widget);
                        onClose();
                      }}
                      style={{
                        padding: `${spacing[2]} ${spacing[3]}`,
                        backgroundColor: colors.primary[500],
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing[1],
                      }}
                    >
                      <Plus style={{ width: '16px', height: '16px' }} />
                      Add Widget
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .widget-card:hover {
          border-color: ${colors.primary[300]};
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
}
