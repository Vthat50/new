import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Zap, Settings, X, Maximize2, Minimize2 } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

export default function DemoControlPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeAcceleration, setTimeAcceleration] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState('new_patient');

  const scenarios = [
    { id: 'new_patient', label: 'New Patient Onboarding', duration: '2 min' },
    { id: 'high_risk', label: 'High-Risk Recovery', duration: '3 min' },
    { id: 'pa_success', label: 'Prior Auth Success', duration: '4 min' },
    { id: 'adverse_event', label: 'Adverse Event Handling', duration: '5 min' },
  ];

  const handleReset = () => {
    setIsPlaying(false);
    setTimeAcceleration(1);
    // Trigger data reset
  };

  if (!isExpanded) {
    return (
      <div
        className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border cursor-pointer z-50"
        style={{ borderColor: colors.primary[500], padding: spacing[3] }}
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center" style={{ gap: spacing[2] }}>
          <Zap style={{ width: '20px', height: '20px', color: colors.primary[500] }} />
          <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
            Demo Controls
          </span>
          <Maximize2 style={{ width: '16px', height: '16px', color: colors.neutral[500] }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border z-50"
      style={{
        width: '360px',
        borderColor: colors.primary[500],
        borderWidth: '2px'
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b"
        style={{
          padding: spacing[4],
          borderColor: colors.neutral[200],
          backgroundColor: colors.primary[50]
        }}
      >
        <div className="flex items-center" style={{ gap: spacing[2] }}>
          <Zap style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
          <h3 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
            Demo Control Panel
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="hover:bg-primary-100 rounded transition-colors"
          style={{ padding: spacing[1] }}
        >
          <Minimize2 style={{ width: '16px', height: '16px' }} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: spacing[4] }}>
        {/* Playback Controls */}
        <div className="flex items-center justify-center" style={{ gap: spacing[3], marginBottom: spacing[4] }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-lg flex items-center justify-center transition-colors"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: isPlaying ? colors.status.warning : colors.primary[500],
              color: 'white'
            }}
          >
            {isPlaying ? (
              <Pause style={{ width: '24px', height: '24px' }} />
            ) : (
              <Play style={{ width: '24px', height: '24px' }} />
            )}
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg flex items-center justify-center hover:bg-neutral-100 transition-colors border"
            style={{
              width: '48px',
              height: '48px',
              borderColor: colors.neutral[300]
            }}
          >
            <RotateCcw style={{ width: '20px', height: '20px', color: colors.neutral[600] }} />
          </button>
        </div>

        {/* Time Acceleration Slider */}
        <div style={{ marginBottom: spacing[4] }}>
          <div className="flex items-center justify-between" style={{ marginBottom: spacing[2] }}>
            <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
              Time Acceleration
            </label>
            <span
              className="rounded px-2 py-1"
              style={{
                backgroundColor: colors.primary[100],
                color: colors.primary[700],
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold
              }}
            >
              {timeAcceleration}x
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={timeAcceleration}
            onChange={(e) => setTimeAcceleration(Number(e.target.value))}
            className="w-full"
            style={{
              accentColor: colors.primary[500]
            }}
          />
          <div className="flex justify-between" style={{ marginTop: spacing[1] }}>
            <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
              1x (Real-time)
            </span>
            <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
              100x (1 month in 7 min)
            </span>
          </div>
        </div>

        {/* Scenario Selector */}
        <div style={{ marginBottom: spacing[4] }}>
          <label
            className="block"
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              marginBottom: spacing[2]
            }}
          >
            Demo Scenario
          </label>
          <div className="space-y-2">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className="w-full flex items-center justify-between rounded-lg border transition-colors"
                style={{
                  padding: spacing[3],
                  borderColor: selectedScenario === scenario.id ? colors.primary[500] : colors.neutral[200],
                  backgroundColor: selectedScenario === scenario.id ? colors.primary[50] : 'white',
                  borderWidth: selectedScenario === scenario.id ? '2px' : '1px'
                }}
              >
                <span
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: selectedScenario === scenario.id ? typography.fontWeight.semibold : typography.fontWeight.normal,
                    color: selectedScenario === scenario.id ? colors.primary[700] : colors.neutral[700]
                  }}
                >
                  {scenario.label}
                </span>
                <span
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[500]
                  }}
                >
                  {scenario.duration}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Display */}
        <div
          className="rounded-lg"
          style={{
            padding: spacing[3],
            backgroundColor: colors.neutral[50],
            border: `1px solid ${colors.neutral[200]}`
          }}
        >
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
            Demo Status
          </div>
          <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
            {isPlaying ? 'Playing' : 'Paused'} - {scenarios.find(s => s.id === selectedScenario)?.label}
          </div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
            {isPlaying ? 'Data updating in real-time' : 'Click Play to start simulation'}
          </div>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={handleReset}
          className="w-full rounded-lg border transition-colors"
          style={{
            padding: `${spacing[2]} ${spacing[3]}`,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            borderColor: colors.neutral[300],
            color: colors.neutral[700],
            marginTop: spacing[3]
          }}
        >
          Reset Demo Data
        </button>
      </div>
    </div>
  );
}
