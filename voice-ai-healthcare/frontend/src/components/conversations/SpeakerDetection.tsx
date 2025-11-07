import React, { useState, useEffect } from 'react';
import { User, Bot, Volume2 } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface SpeakerDetectionProps {
  activeSpeaker: 'patient' | 'agent' | 'none';
  patientName: string;
  agentName: string;
  patientVolume?: number;
  agentVolume?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  showVolumeBars?: boolean;
}

export default function SpeakerDetection({
  activeSpeaker,
  patientName,
  agentName,
  patientVolume = 0,
  agentVolume = 0,
  sentiment = 'neutral',
  showVolumeBars = true,
}: SpeakerDetectionProps) {
  const [patientAnimatedVolume, setPatientAnimatedVolume] = useState(0);
  const [agentAnimatedVolume, setAgentAnimatedVolume] = useState(0);

  useEffect(() => {
    // Animate volume changes
    const interval = setInterval(() => {
      setPatientAnimatedVolume((prev) => {
        const diff = patientVolume - prev;
        return prev + diff * 0.3;
      });
      setAgentAnimatedVolume((prev) => {
        const diff = agentVolume - prev;
        return prev + diff * 0.3;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [patientVolume, agentVolume]);

  const getSentimentColor = () => {
    switch (sentiment) {
      case 'positive':
        return colors.status.success;
      case 'negative':
        return colors.status.error;
      default:
        return colors.neutral[500];
    }
  };

  const renderSpeaker = (
    type: 'patient' | 'agent',
    name: string,
    icon: React.ReactNode,
    volume: number,
    isActive: boolean
  ) => {
    return (
      <div
        style={{
          flex: 1,
          padding: spacing[4],
          backgroundColor: isActive ? colors.primary[50] : colors.neutral[50],
          border: `2px solid ${isActive ? colors.primary[500] : colors.neutral[200]}`,
          borderRadius: '8px',
          transition: 'all 0.3s',
        }}
      >
        {/* Speaker Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[3] }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: isActive ? colors.primary[500] : colors.neutral[300],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              position: 'relative',
            }}
          >
            {icon}
            {/* Active pulse ring */}
            {isActive && (
              <>
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: `2px solid ${colors.primary[500]}`,
                    animation: 'pulse-ring 2s infinite',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: `2px solid ${colors.primary[500]}`,
                    animation: 'pulse-ring 2s infinite 1s',
                  }}
                />
              </>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[1],
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.neutral[600],
              }}
            >
              {type === 'patient' ? 'Patient' : 'AI Agent'}
            </div>
          </div>

          {/* Volume Icon */}
          {isActive && (
            <Volume2
              style={{
                width: '20px',
                height: '20px',
                color: colors.primary[500],
                animation: 'pulse 1.5s infinite',
              }}
            />
          )}
        </div>

        {/* Volume Bars */}
        {showVolumeBars && (
          <div>
            <div
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.neutral[600],
                marginBottom: spacing[2],
              }}
            >
              Audio Level
            </div>
            <div
              style={{
                height: '8px',
                backgroundColor: colors.neutral[200],
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${volume}%`,
                  backgroundColor: isActive ? colors.primary[500] : colors.neutral[400],
                  transition: 'width 0.1s, background-color 0.3s',
                }}
              />
            </div>

            {/* Visual Equalizer Bars */}
            {isActive && (
              <div
                style={{
                  display: 'flex',
                  gap: spacing[1],
                  marginTop: spacing[3],
                  height: '40px',
                  alignItems: 'flex-end',
                }}
              >
                {[0.3, 0.7, 0.5, 0.9, 0.4, 0.8, 0.6, 0.2].map((multiplier, index) => (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      backgroundColor: colors.primary[500],
                      borderRadius: '2px',
                      height: `${(volume * multiplier) / 2}%`,
                      animation: `eq-bar 0.${3 + index}s ease-in-out infinite alternate`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sentiment Indicator (patient only) */}
        {type === 'patient' && isActive && (
          <div
            style={{
              marginTop: spacing[3],
              padding: spacing[2],
              backgroundColor: 'white',
              borderRadius: '4px',
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
                backgroundColor: getSentimentColor(),
              }}
            />
            <span
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.neutral[700],
                textTransform: 'capitalize',
              }}
            >
              {sentiment} Sentiment
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        padding: spacing[4],
        backgroundColor: 'white',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: spacing[4] }}>
        <h3
          style={{
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing[1],
          }}
        >
          Active Speaker Detection
        </h3>
        <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
          Real-time speaker identification and audio analysis
        </p>
      </div>

      {/* Speakers */}
      <div style={{ display: 'flex', gap: spacing[4] }}>
        {renderSpeaker(
          'patient',
          patientName,
          <User style={{ width: '24px', height: '24px' }} />,
          patientAnimatedVolume,
          activeSpeaker === 'patient'
        )}

        {renderSpeaker(
          'agent',
          agentName,
          <Bot style={{ width: '24px', height: '24px' }} />,
          agentAnimatedVolume,
          activeSpeaker === 'agent'
        )}
      </div>

      {/* Status Message */}
      {activeSpeaker === 'none' && (
        <div
          style={{
            marginTop: spacing[4],
            padding: spacing[3],
            backgroundColor: colors.neutral[50],
            borderRadius: '6px',
            textAlign: 'center',
            fontSize: typography.fontSize.sm,
            color: colors.neutral[600],
          }}
        >
          Listening...
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes eq-bar {
          from {
            height: 10%;
          }
          to {
            height: 90%;
          }
        }
      `}</style>
    </div>
  );
}
