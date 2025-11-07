import React, { useState, useEffect } from 'react';
import { Phone, X } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface ActiveCall {
  id: string;
  lat: number;
  lng: number;
  patientName: string;
  patientId: string;
  callReason: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  duration: string;
  transcriptSnippet: string;
}

interface LiveActivityMapProps {
  activeCalls: ActiveCall[];
  onJumpToCall: (callId: string) => void;
}

export default function LiveActivityMap({ activeCalls, onJumpToCall }: LiveActivityMapProps) {
  const [selectedCall, setSelectedCall] = useState<ActiveCall | null>(null);
  const [showPanel, setShowPanel] = useState(true);

  // Convert lat/lng to SVG coordinates (simplified US map projection)
  const latLngToXY = (lat: number, lng: number) => {
    // Simple mercator-ish projection for US
    const x = ((lng + 125) / 55) * 800; // Rough US longitude range
    const y = ((50 - lat) / 25) * 500;  // Rough US latitude range
    return { x: Math.max(0, Math.min(800, x)), y: Math.max(0, Math.min(500, y)) };
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return colors.status.success;
      case 'neutral': return colors.status.warning;
      case 'negative': return colors.status.error;
      default: return colors.primary[500];
    }
  };

  // Simplified US states paths (subset for visualization)
  const usStates = [
    // California
    'M 120,300 L 110,320 L 105,350 L 100,380 L 110,400 L 130,410 L 150,400 L 160,380 L 165,350 L 160,320 L 140,305 Z',
    // Texas
    'M 380,350 L 370,370 L 365,400 L 375,430 L 400,445 L 430,445 L 460,430 L 470,400 L 465,370 L 450,355 Z',
    // Florida
    'M 620,380 L 615,400 L 610,420 L 605,445 L 610,470 L 620,485 L 630,470 L 635,445 L 640,420 L 642,400 L 638,380 Z',
    // New York
    'M 710,180 L 700,190 L 695,205 L 705,220 L 725,225 L 745,220 L 755,205 L 750,185 Z',
    // More states (simplified outlines)
    'M 200,150 L 250,160 L 280,170 L 280,200 L 250,210 L 200,200 Z', // Northwest
    'M 350,200 L 400,210 L 430,220 L 430,250 L 400,260 L 350,250 Z', // Midwest
    'M 600,250 L 650,260 L 680,270 L 680,300 L 650,310 L 600,300 Z', // Northeast
  ];

  return (
    <div style={{ display: 'flex', gap: spacing[4], height: '500px' }}>
      {/* Map Container */}
      <div
        style={{
          flex: showPanel ? 2 : 1,
          position: 'relative',
          backgroundColor: colors.neutral[50],
          borderRadius: '12px',
          border: `1px solid ${colors.neutral[200]}`,
          overflow: 'hidden'
        }}
      >
        <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%' }}>
          {/* Background */}
          <rect width="800" height="500" fill={colors.neutral[100]} />

          {/* US States */}
          {usStates.map((path, idx) => (
            <path
              key={idx}
              d={path}
              fill={colors.neutral[200]}
              stroke={colors.neutral[300]}
              strokeWidth="1"
              opacity="0.6"
            />
          ))}

          {/* Active Call Indicators */}
          {activeCalls.map((call) => {
            const { x, y } = latLngToXY(call.lat, call.lng);
            const isSelected = selectedCall?.id === call.id;

            return (
              <g key={call.id}>
                {/* Outer pulsing ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 20 : 15}
                  fill={getSentimentColor(call.sentiment)}
                  opacity="0.3"
                  style={{
                    animation: 'pulse 2s infinite',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedCall(call)}
                />

                {/* Inner solid dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 8 : 6}
                  fill={getSentimentColor(call.sentiment)}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedCall(call)}
                />

                {/* Icon */}
                <circle
                  cx={x}
                  cy={y}
                  r={3}
                  fill="white"
                  style={{ cursor: 'pointer', pointerEvents: 'none' }}
                />
              </g>
            );
          })}
        </svg>

        {/* CSS for pulsing animation */}
        <style>{`
          @keyframes pulse {
            0% {
              r: 15;
              opacity: 0.3;
            }
            50% {
              r: 25;
              opacity: 0.1;
            }
            100% {
              r: 15;
              opacity: 0.3;
            }
          }
        `}</style>

        {/* Map Header */}
        <div
          style={{
            position: 'absolute',
            top: spacing[4],
            left: spacing[4],
            backgroundColor: 'white',
            padding: spacing[3],
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
            Live Activity Monitor
          </div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
            {activeCalls.length} active calls
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {showPanel && (
        <div
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `1px solid ${colors.neutral[200]}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Panel Header */}
          <div
            style={{
              padding: spacing[4],
              borderBottom: `1px solid ${colors.neutral[200]}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                Active Conversations
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
                Click map markers for details
              </div>
            </div>
            <button
              onClick={() => setShowPanel(false)}
              style={{
                padding: spacing[2],
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: colors.neutral[400],
              }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* Call List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: spacing[4] }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              {activeCalls.map((call) => {
                const isSelected = selectedCall?.id === call.id;

                return (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    style={{
                      padding: spacing[3],
                      borderRadius: '8px',
                      border: `2px solid ${isSelected ? colors.primary[500] : colors.neutral[200]}`,
                      backgroundColor: isSelected ? colors.primary[50] : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: spacing[2], marginBottom: spacing[2] }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: getSentimentColor(call.sentiment) + '20',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Phone style={{ width: '16px', height: '16px', color: getSentimentColor(call.sentiment) }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                          {call.patientName}
                        </div>
                        <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                          {call.patientId} • {call.duration}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: getSentimentColor(call.sentiment),
                          animation: 'pulse-dot 2s infinite',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[600],
                        padding: spacing[2],
                        backgroundColor: colors.neutral[50],
                        borderRadius: '4px',
                        marginBottom: spacing[2],
                      }}
                    >
                      <strong>Reason:</strong> {call.callReason}
                    </div>

                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[500],
                        fontStyle: 'italic',
                        marginBottom: spacing[2],
                      }}
                    >
                      "{call.transcriptSnippet}..."
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onJumpToCall(call.id);
                      }}
                      style={{
                        width: '100%',
                        padding: `${spacing[2]} ${spacing[3]}`,
                        backgroundColor: colors.primary[500],
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.medium,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      Jump to Call
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Show panel button when hidden */}
      {!showPanel && (
        <button
          onClick={() => setShowPanel(true)}
          style={{
            position: 'absolute',
            right: spacing[4],
            top: '50%',
            transform: 'translateY(-50%)',
            padding: spacing[3],
            backgroundColor: colors.primary[500],
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          Show Panel
        </button>
      )}

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
