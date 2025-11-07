import React, { useState, useRef, useEffect } from 'react';
import {  Play, Pause, SkipBack, SkipForward, Volume2, Download } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface AudioPlayerProps {
  audioUrl?: string;
  title?: string;
}

export default function AudioPlayer({ audioUrl, title = 'Call Recording' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(324); // 5:24 in seconds (simulated)
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Simulate playback for demo since we don't have real audio files
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const handleSkipForward = () => {
    setCurrentTime((prev) => Math.min(prev + 10, duration));
  };

  const handleSkipBack = () => {
    setCurrentTime((prev) => Math.max(prev - 10, 0));
  };

  // Generate simulated waveform data
  const waveformBars = Array.from({ length: 100 }, (_, i) => {
    const baseHeight = 20 + Math.sin(i / 5) * 15 + Math.random() * 30;
    const progress = currentTime / duration;
    const isPassed = i / 100 < progress;
    return { height: baseHeight, isPassed };
  });

  return (
    <div
      className="rounded-lg border"
      style={{
        padding: spacing[6],
        borderColor: colors.neutral[200],
        backgroundColor: 'white'
      }}
    >
      {/* Title and Download */}
      <div className="flex items-center justify-between" style={{ marginBottom: spacing[4] }}>
        <h4 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
          {title}
        </h4>
        <button
          className="flex items-center hover:bg-neutral-100 rounded transition-colors"
          style={{ padding: spacing[2], gap: spacing[2], fontSize: typography.fontSize.sm }}
        >
          <Download style={{ width: '16px', height: '16px' }} />
          Download
        </button>
      </div>

      {/* Waveform Visualization */}
      <div
        className="rounded"
        style={{
          height: '80px',
          backgroundColor: colors.neutral[50],
          padding: spacing[3],
          marginBottom: spacing[4],
          overflow: 'hidden'
        }}
      >
        <div className="flex items-end justify-between h-full" style={{ gap: '2px' }}>
          {waveformBars.map((bar, i) => (
            <div
              key={i}
              className="flex-1 rounded-t transition-colors"
              style={{
                height: `${bar.height}%`,
                backgroundColor: bar.isPassed ? colors.primary[500] : colors.neutral[300],
                minWidth: '2px'
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: spacing[4] }}>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full"
          style={{
            accentColor: colors.primary[500],
            height: '6px'
          }}
        />
        <div className="flex items-center justify-between" style={{ marginTop: spacing[1] }}>
          <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
            {formatTime(currentTime)}
          </span>
          <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Playback Controls */}
        <div className="flex items-center" style={{ gap: spacing[2] }}>
          <button
            onClick={handleSkipBack}
            className="rounded-full hover:bg-neutral-100 transition-colors flex items-center justify-center"
            style={{ width: '40px', height: '40px' }}
          >
            <SkipBack style={{ width: '20px', height: '20px', color: colors.neutral[700] }} />
          </button>
          <button
            onClick={handlePlayPause}
            className="rounded-full flex items-center justify-center transition-colors"
            style={{
              width: '56px',
              height: '56px',
              backgroundColor: colors.primary[500],
              color: 'white'
            }}
          >
            {isPlaying ? (
              <Pause style={{ width: '24px', height: '24px' }} />
            ) : (
              <Play style={{ width: '24px', height: '24px', marginLeft: '2px' }} />
            )}
          </button>
          <button
            onClick={handleSkipForward}
            className="rounded-full hover:bg-neutral-100 transition-colors flex items-center justify-center"
            style={{ width: '40px', height: '40px' }}
          >
            <SkipForward style={{ width: '20px', height: '20px', color: colors.neutral[700] }} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center" style={{ gap: spacing[2], minWidth: '150px' }}>
          <Volume2 style={{ width: '20px', height: '20px', color: colors.neutral[600] }} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1"
            style={{ accentColor: colors.primary[500] }}
          />
        </div>

        {/* Speed Control */}
        <div className="flex items-center" style={{ gap: spacing[2] }}>
          <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
            Speed:
          </span>
          <select
            className="px-2 py-1 border rounded"
            style={{
              fontSize: typography.fontSize.xs,
              borderColor: colors.neutral[300]
            }}
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1" selected>1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>

      {/* Hidden audio element for future real audio support */}
      <audio ref={audioRef} src={audioUrl} style={{ display: 'none' }} />
    </div>
  );
}
