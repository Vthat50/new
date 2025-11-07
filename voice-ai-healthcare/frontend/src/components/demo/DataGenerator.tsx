import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, Zap } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface DataGeneratorProps {
  onGenerate: (settings: GeneratorSettings) => void;
  onReset: () => void;
  isRunning: boolean;
  onToggle: () => void;
}

interface GeneratorSettings {
  callVolume: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  conversionRate: number;
  averageDuration: number;
  timeAcceleration: number;
}

export default function DataGenerator({
  onGenerate,
  onReset,
  isRunning,
  onToggle,
}: DataGeneratorProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GeneratorSettings>({
    callVolume: 50,
    sentimentDistribution: {
      positive: 60,
      neutral: 30,
      negative: 10,
    },
    conversionRate: 35,
    averageDuration: 8,
    timeAcceleration: 1,
  });

  const handleSettingChange = (key: keyof GeneratorSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onGenerate(newSettings);
  };

  const handleSentimentChange = (sentiment: 'positive' | 'neutral' | 'negative', value: number) => {
    // Normalize to ensure total = 100%
    const other1 = sentiment === 'positive' ? 'neutral' : 'positive';
    const other2 = sentiment === 'negative' ? 'neutral' : 'negative';

    const remaining = 100 - value;
    const currentOther1 = settings.sentimentDistribution[other1];
    const currentOther2 = settings.sentimentDistribution[other2];
    const currentTotal = currentOther1 + currentOther2;

    const newSettings = {
      ...settings,
      sentimentDistribution: {
        ...settings.sentimentDistribution,
        [sentiment]: value,
        [other1]: currentTotal > 0 ? Math.round((currentOther1 / currentTotal) * remaining) : remaining / 2,
        [other2]: currentTotal > 0 ? Math.round((currentOther2 / currentTotal) * remaining) : remaining / 2,
      },
    };
    setSettings(newSettings);
    onGenerate(newSettings);
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '12px',
        padding: spacing[6],
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: colors.primary[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary[700],
            }}
          >
            <Zap style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                margin: 0,
              }}
            >
              Demo Data Generator
            </h3>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], margin: 0 }}>
              Simulate realistic call data in real-time
            </p>
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: spacing[2] }}>
          <button
            onClick={onToggle}
            style={{
              padding: `${spacing[2]} ${spacing[4]}`,
              backgroundColor: isRunning ? colors.status.error : colors.status.success,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            {isRunning ? (
              <>
                <Pause style={{ width: '16px', height: '16px' }} />
                Pause
              </>
            ) : (
              <>
                <Play style={{ width: '16px', height: '16px' }} />
                Start
              </>
            )}
          </button>

          <button
            onClick={onReset}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <RotateCcw style={{ width: '16px', height: '16px' }} />
            Reset
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              backgroundColor: showSettings ? colors.primary[500] : 'white',
              color: showSettings ? 'white' : colors.neutral[700],
              border: `1px solid ${showSettings ? colors.primary[500] : colors.neutral[300]}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <Settings style={{ width: '16px', height: '16px' }} />
            Settings
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      {isRunning && (
        <div
          style={{
            padding: spacing[3],
            backgroundColor: colors.status.successBg,
            border: `1px solid ${colors.status.success}`,
            borderRadius: '6px',
            marginBottom: spacing[4],
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: colors.status.success,
              animation: 'pulse 2s infinite',
            }}
          />
          <span style={{ fontSize: typography.fontSize.sm, color: colors.status.success, fontWeight: typography.fontWeight.medium }}>
            Generating demo data at {settings.timeAcceleration}x speed
          </span>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div
          style={{
            padding: spacing[4],
            backgroundColor: colors.neutral[50],
            borderRadius: '8px',
            marginBottom: spacing[4],
          }}
        >
          {/* Call Volume */}
          <div style={{ marginBottom: spacing[4] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
              <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                Calls per Hour
              </label>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                {settings.callVolume}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={settings.callVolume}
              onChange={(e) => handleSettingChange('callVolume', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div style={{ marginBottom: spacing[4] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[3] }}>
              Sentiment Distribution
            </label>

            {/* Positive */}
            <div style={{ marginBottom: spacing[3] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[1] }}>
                <span style={{ fontSize: typography.fontSize.xs, color: colors.status.success }}>Positive</span>
                <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                  {settings.sentimentDistribution.positive}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sentimentDistribution.positive}
                onChange={(e) => handleSentimentChange('positive', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Neutral */}
            <div style={{ marginBottom: spacing[3] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[1] }}>
                <span style={{ fontSize: typography.fontSize.xs, color: colors.status.warning }}>Neutral</span>
                <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                  {settings.sentimentDistribution.neutral}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sentimentDistribution.neutral}
                onChange={(e) => handleSentimentChange('neutral', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Negative */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[1] }}>
                <span style={{ fontSize: typography.fontSize.xs, color: colors.status.error }}>Negative</span>
                <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                  {settings.sentimentDistribution.negative}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sentimentDistribution.negative}
                onChange={(e) => handleSentimentChange('negative', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Conversion Rate */}
          <div style={{ marginBottom: spacing[4] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
              <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                Conversion Rate
              </label>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                {settings.conversionRate}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.conversionRate}
              onChange={(e) => handleSettingChange('conversionRate', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Average Duration */}
          <div style={{ marginBottom: spacing[4] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
              <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                Average Call Duration
              </label>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                {settings.averageDuration} min
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={settings.averageDuration}
              onChange={(e) => handleSettingChange('averageDuration', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Time Acceleration */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
              <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                Time Acceleration
              </label>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                {settings.timeAcceleration}x
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={settings.timeAcceleration}
              onChange={(e) => handleSettingChange('timeAcceleration', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
              <span>Real-time</span>
              <span>100x faster</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
