import React, { useState } from 'react';
import { Filter, X, Calendar, User, MessageSquare, TrendingUp } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface ConversationFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

interface FilterState {
  dateRange: string;
  customStartDate: string;
  customEndDate: string;
  callStatus: string[];
  sentiment: string[];
  duration: {
    min: number;
    max: number;
  };
  topics: string[];
  complianceScore: {
    min: number;
    max: number;
  };
  agent: string;
  outcome: string[];
}

export default function ConversationFilters({ isOpen, onClose, onApply }: ConversationFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    customStartDate: '',
    customEndDate: '',
    callStatus: [],
    sentiment: [],
    duration: { min: 0, max: 3600 },
    topics: [],
    complianceScore: { min: 0, max: 100 },
    agent: 'all',
    outcome: [],
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateRange: 'all',
      customStartDate: '',
      customEndDate: '',
      callStatus: [],
      sentiment: [],
      duration: { min: 0, max: 3600 },
      topics: [],
      complianceScore: { min: 0, max: 100 },
      agent: 'all',
      outcome: [],
    });
  };

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    setFilters({ ...filters, [key]: newArray });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '320px',
        backgroundColor: 'white',
        borderRight: `1px solid ${colors.neutral[200]}`,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: spacing[4],
          borderBottom: `1px solid ${colors.neutral[200]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <Filter style={{ width: '20px', height: '20px', color: colors.primary[500] }} />
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Filters
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: spacing[2],
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>
      </div>

      {/* Filters */}
      <div style={{ flex: 1, overflowY: 'auto', padding: spacing[4] }}>
        {/* Date Range */}
        <div style={{ marginBottom: spacing[6] }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[3],
            }}
          >
            <Calendar style={{ width: '16px', height: '16px' }} />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            style={{
              width: '100%',
              padding: spacing[2],
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              marginBottom: spacing[2],
            }}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {filters.dateRange === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              <input
                type="date"
                value={filters.customStartDate}
                onChange={(e) => setFilters({ ...filters, customStartDate: e.target.value })}
                style={{
                  padding: spacing[2],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              />
              <input
                type="date"
                value={filters.customEndDate}
                onChange={(e) => setFilters({ ...filters, customEndDate: e.target.value })}
                style={{
                  padding: spacing[2],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              />
            </div>
          )}
        </div>

        {/* Call Status */}
        <div style={{ marginBottom: spacing[6] }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[3],
            }}
          >
            <MessageSquare style={{ width: '16px', height: '16px' }} />
            Call Status
          </label>
          {['Active', 'Completed', 'Missed', 'Voicemail'].map((status) => (
            <label
              key={status}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                marginBottom: spacing[2],
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={filters.callStatus.includes(status.toLowerCase())}
                onChange={() => toggleArrayFilter('callStatus', status.toLowerCase())}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: typography.fontSize.sm }}>{status}</span>
            </label>
          ))}
        </div>

        {/* Sentiment */}
        <div style={{ marginBottom: spacing[6] }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[3],
            }}
          >
            <TrendingUp style={{ width: '16px', height: '16px' }} />
            Sentiment
          </label>
          {['Positive', 'Neutral', 'Negative'].map((sent) => (
            <label
              key={sent}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                marginBottom: spacing[2],
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={filters.sentiment.includes(sent.toLowerCase())}
                onChange={() => toggleArrayFilter('sentiment', sent.toLowerCase())}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: typography.fontSize.sm }}>{sent}</span>
            </label>
          ))}
        </div>

        {/* Topics */}
        <div style={{ marginBottom: spacing[6] }}>
          <label
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[3],
              display: 'block',
            }}
          >
            Topics Discussed
          </label>
          {[
            'Refill Request',
            'Side Effects',
            'Prior Authorization',
            'Insurance Issues',
            'Dosage Questions',
            'Adherence Support',
          ].map((topic) => (
            <label
              key={topic}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                marginBottom: spacing[2],
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={filters.topics.includes(topic.toLowerCase())}
                onChange={() => toggleArrayFilter('topics', topic.toLowerCase())}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: typography.fontSize.sm }}>{topic}</span>
            </label>
          ))}
        </div>

        {/* Call Duration */}
        <div style={{ marginBottom: spacing[6] }}>
          <label
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[3],
              display: 'block',
            }}
          >
            Call Duration (minutes)
          </label>
          <div style={{ display: 'flex', gap: spacing[2], alignItems: 'center' }}>
            <input
              type="number"
              value={Math.floor(filters.duration.min / 60)}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  duration: { ...filters.duration, min: parseInt(e.target.value) * 60 },
                })
              }
              min="0"
              style={{
                flex: 1,
                padding: spacing[2],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            />
            <span style={{ color: colors.neutral[500] }}>to</span>
            <input
              type="number"
              value={Math.floor(filters.duration.max / 60)}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  duration: { ...filters.duration, max: parseInt(e.target.value) * 60 },
                })
              }
              min="0"
              style={{
                flex: 1,
                padding: spacing[2],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            />
          </div>
        </div>

        {/* Compliance Score */}
        <div style={{ marginBottom: spacing[6] }}>
          <label
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[3],
              display: 'block',
            }}
          >
            Compliance Score
          </label>
          <div style={{ padding: spacing[3], backgroundColor: colors.neutral[50], borderRadius: '6px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: spacing[2],
                fontSize: typography.fontSize.sm,
              }}
            >
              <span>{filters.complianceScore.min}%</span>
              <span>{filters.complianceScore.max}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.complianceScore.min}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  complianceScore: { ...filters.complianceScore, min: parseInt(e.target.value) },
                })
              }
              style={{ width: '100%', marginBottom: spacing[2] }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={filters.complianceScore.max}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  complianceScore: { ...filters.complianceScore, max: parseInt(e.target.value) },
                })
              }
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Outcome */}
        <div style={{ marginBottom: spacing[6] }}>
          <label
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[3],
              display: 'block',
            }}
          >
            Call Outcome
          </label>
          {['Issue Resolved', 'Callback Scheduled', 'Transferred', 'No Action Needed', 'Follow-up Required'].map(
            (outcome) => (
              <label
                key={outcome}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  marginBottom: spacing[2],
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.outcome.includes(outcome.toLowerCase())}
                  onChange={() => toggleArrayFilter('outcome', outcome.toLowerCase())}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: typography.fontSize.sm }}>{outcome}</span>
              </label>
            )
          )}
        </div>

        {/* Agent */}
        <div style={{ marginBottom: spacing[6] }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[3],
            }}
          >
            <User style={{ width: '16px', height: '16px' }} />
            Agent
          </label>
          <select
            value={filters.agent}
            onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
            style={{
              width: '100%',
              padding: spacing[2],
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
            }}
          >
            <option value="all">All Agents</option>
            <option value="ai-agent-1">AI Agent Alpha</option>
            <option value="ai-agent-2">AI Agent Beta</option>
            <option value="human-agent-1">Human Agent - John</option>
            <option value="human-agent-2">Human Agent - Sarah</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: spacing[4],
          borderTop: `1px solid ${colors.neutral[200]}`,
          display: 'flex',
          gap: spacing[2],
        }}
      >
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            padding: spacing[3],
            border: `1px solid ${colors.neutral[300]}`,
            backgroundColor: 'white',
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          style={{
            flex: 1,
            padding: spacing[3],
            border: 'none',
            backgroundColor: colors.primary[500],
            color: 'white',
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            cursor: 'pointer',
          }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
