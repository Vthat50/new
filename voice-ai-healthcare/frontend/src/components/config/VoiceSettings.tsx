import React, { useState } from 'react';
import { Volume2, Play, Pause, Download } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  accent: string;
  language: string;
  sampleUrl?: string;
  description?: string;
}

interface VoiceSettingsProps {
  selectedVoiceId?: string;
  onVoiceChange: (voiceId: string) => void;
  onSettingsChange?: (settings: VoiceSettings) => void;
}

interface VoiceSettings {
  speed: number;
  pitch: number;
  volume: number;
  pauseDuration: number;
}

const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'voice_sarah',
    name: 'Sarah',
    gender: 'female',
    accent: 'American',
    language: 'en-US',
    description: 'Warm and professional',
    sampleUrl: '/samples/sarah.mp3',
  },
  {
    id: 'voice_james',
    name: 'James',
    gender: 'male',
    accent: 'British',
    language: 'en-GB',
    description: 'Clear and authoritative',
    sampleUrl: '/samples/james.mp3',
  },
  {
    id: 'voice_maria',
    name: 'Maria',
    gender: 'female',
    accent: 'Spanish',
    language: 'es-US',
    description: 'Friendly and approachable',
    sampleUrl: '/samples/maria.mp3',
  },
  {
    id: 'voice_alex',
    name: 'Alex',
    gender: 'neutral',
    accent: 'American',
    language: 'en-US',
    description: 'Neutral and calm',
    sampleUrl: '/samples/alex.mp3',
  },
];

export default function VoiceSettings({
  selectedVoiceId = 'voice_sarah',
  onVoiceChange,
  onSettingsChange,
}: VoiceSettingsProps) {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [settings, setSettings] = useState<VoiceSettings>({
    speed: 1.0,
    pitch: 1.0,
    volume: 0.8,
    pauseDuration: 0.5,
  });

  const handlePlaySample = (voiceId: string) => {
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
      // Stop audio playback
    } else {
      setPlayingVoiceId(voiceId);
      // Play audio sample
      setTimeout(() => setPlayingVoiceId(null), 3000); // Simulate 3s sample
    }
  };

  const handleSettingChange = (key: keyof VoiceSettings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
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
      <h3
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing[4],
        }}
      >
        Voice Settings
      </h3>

      {/* Voice Selection */}
      <div style={{ marginBottom: spacing[6] }}>
        <label
          style={{
            display: 'block',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            marginBottom: spacing[3],
          }}
        >
          Select Voice
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: spacing[3] }}>
          {VOICE_OPTIONS.map((voice) => {
            const isSelected = selectedVoiceId === voice.id;
            const isPlaying = playingVoiceId === voice.id;

            return (
              <div
                key={voice.id}
                onClick={() => onVoiceChange(voice.id)}
                style={{
                  padding: spacing[4],
                  border: `2px solid ${isSelected ? colors.primary[500] : colors.neutral[200]}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? colors.primary[50] : 'white',
                  transition: 'all 0.2s',
                }}
                className="voice-option"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[2] }}>
                  <div>
                    <div
                      style={{
                        fontSize: typography.fontSize.md,
                        fontWeight: typography.fontWeight.semibold,
                        marginBottom: spacing[1],
                      }}
                    >
                      {voice.name}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                      {voice.gender} • {voice.accent}
                    </div>
                  </div>

                  {/* Play Sample Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySample(voice.id);
                    }}
                    style={{
                      padding: spacing[2],
                      backgroundColor: colors.primary[100],
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      color: colors.primary[700],
                    }}
                    title="Play sample"
                  >
                    {isPlaying ? (
                      <Pause style={{ width: '16px', height: '16px' }} />
                    ) : (
                      <Play style={{ width: '16px', height: '16px' }} />
                    )}
                  </button>
                </div>

                {voice.description && (
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[600],
                      margin: 0,
                    }}
                  >
                    {voice.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice Parameters */}
      <div
        style={{
          padding: spacing[4],
          backgroundColor: colors.neutral[50],
          borderRadius: '8px',
        }}
      >
        <h4
          style={{
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing[4],
          }}
        >
          Voice Parameters
        </h4>

        {/* Speed */}
        <div style={{ marginBottom: spacing[4] }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
            <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
              Speaking Speed
            </label>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              {settings.speed.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.speed}
            onChange={(e) => handleSettingChange('speed', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
            <span>Slower</span>
            <span>Faster</span>
          </div>
        </div>

        {/* Pitch */}
        <div style={{ marginBottom: spacing[4] }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
            <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
              Voice Pitch
            </label>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              {settings.pitch.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.pitch}
            onChange={(e) => handleSettingChange('pitch', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
            <span>Lower</span>
            <span>Higher</span>
          </div>
        </div>

        {/* Volume */}
        <div style={{ marginBottom: spacing[4] }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
            <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
              <Volume2 style={{ width: '14px', height: '14px', display: 'inline', marginRight: spacing[1] }} />
              Volume
            </label>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              {Math.round(settings.volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={(e) => handleSettingChange('volume', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* Pause Duration */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
            <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
              Pause Between Sentences
            </label>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              {settings.pauseDuration.toFixed(1)}s
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={settings.pauseDuration}
            onChange={(e) => handleSettingChange('pauseDuration', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <style>{`
        .voice-option:hover {
          border-color: ${colors.primary[400]};
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
