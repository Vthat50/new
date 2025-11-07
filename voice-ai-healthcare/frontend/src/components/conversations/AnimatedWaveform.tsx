import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface AnimatedWaveformProps {
  audioUrl?: string;
  isLive?: boolean;
  isActive?: boolean;
  duration?: number;
  currentTime?: number;
  onSeek?: (time: number) => void;
  onPlayPause?: (isPlaying: boolean) => void;
  height?: number;
}

export default function AnimatedWaveform({
  audioUrl,
  isLive = false,
  isActive = false,
  duration = 0,
  currentTime = 0,
  onSeek,
  onPlayPause,
  height = 80,
}: AnimatedWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);
  const animationFrameRef = useRef<number>();

  // Generate waveform data
  const generateWaveformData = (count: number): number[] => {
    const data: number[] = [];
    for (let i = 0; i < count; i++) {
      // Create varied amplitude for more realistic waveform
      const baseAmplitude = Math.sin(i / 10) * 0.5 + 0.5; // Slow wave
      const noise = Math.random() * 0.3; // Add randomness
      data.push(Math.min(baseAmplitude + noise, 1));
    }
    return data;
  };

  const [waveformData] = useState(() => generateWaveformData(200));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / waveformData.length;
      const progress = duration > 0 ? currentTime / duration : 0;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw waveform bars
      waveformData.forEach((amplitude, index) => {
        const x = index * barWidth;
        const barHeight = amplitude * height * 0.8;
        const y = (height - barHeight) / 2;

        // Determine color based on playback progress
        const barProgress = index / waveformData.length;
        let barColor: string;

        if (isLive && isActive) {
          // Live active call - pulsing effect
          const pulseIntensity = Math.sin(Date.now() / 200 + index / 10) * 0.3 + 0.7;
          barColor = `rgba(34, 197, 94, ${pulseIntensity})`;
        } else if (hoveredTime !== null) {
          // Hovering - show preview
          const hoverProgress = hoveredTime / duration;
          barColor = barProgress <= hoverProgress ? colors.primary[500] : colors.neutral[300];
        } else if (barProgress <= progress) {
          // Played portion
          barColor = colors.primary[500];
        } else {
          // Unplayed portion
          barColor = colors.neutral[300];
        }

        ctx.fillStyle = barColor;
        ctx.fillRect(x, y, Math.max(barWidth - 1, 1), barHeight);
      });

      // Draw playhead
      if (!isLive && duration > 0) {
        const playheadX = progress * width;
        ctx.strokeStyle = colors.primary[600];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, height);
        ctx.stroke();
      }

      if (isLive && isActive) {
        animationFrameRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [waveformData, currentTime, duration, isLive, isActive, hoveredTime]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isLive || !onSeek || duration === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickProgress = x / rect.width;
    const seekTime = clickProgress * duration;

    onSeek(seekTime);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isLive || duration === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const hoverProgress = x / rect.width;
    const time = hoverProgress * duration;

    setHoveredTime(time);
  };

  const handleCanvasMouseLeave = () => {
    setHoveredTime(null);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    if (onPlayPause) {
      onPlayPause(newState);
    }
  };

  return (
    <div
      style={{
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        padding: spacing[3],
        backgroundColor: 'white',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
        {/* Play/Pause Button (not shown for live) */}
        {!isLive && (
          <button
            onClick={handlePlayPause}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: colors.primary[500],
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {isPlaying ? <Pause style={{ width: '20px', height: '20px' }} /> : <Play style={{ width: '20px', height: '20px', marginLeft: '2px' }} />}
          </button>
        )}

        {/* Live Indicator */}
        {isLive && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: isActive ? colors.status.error : colors.neutral[400],
                animation: isActive ? 'pulse 2s infinite' : 'none',
              }}
            />
            <span
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: isActive ? colors.status.error : colors.neutral[600],
              }}
            >
              {isActive ? 'LIVE' : 'Ended'}
            </span>
          </div>
        )}

        {/* Waveform Canvas */}
        <div style={{ flex: 1, position: 'relative' }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={height}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleCanvasMouseLeave}
            style={{
              width: '100%',
              height: `${height}px`,
              cursor: isLive ? 'default' : 'pointer',
            }}
          />

          {/* Hover time tooltip */}
          {hoveredTime !== null && !isLive && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: `${(hoveredTime / duration) * 100}%`,
                transform: 'translateX(-50%)',
                marginBottom: spacing[2],
                padding: `${spacing[1]} ${spacing[2]}`,
                backgroundColor: colors.neutral[900],
                color: 'white',
                borderRadius: '4px',
                fontSize: typography.fontSize.xs,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {formatTime(hoveredTime)}
            </div>
          )}
        </div>

        {/* Time Display */}
        {!isLive && duration > 0 && (
          <div
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600],
              fontVariantNumeric: 'tabular-nums',
              flexShrink: 0,
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}

        {/* Volume Icon */}
        <Volume2 style={{ width: '20px', height: '20px', color: colors.neutral[400], flexShrink: 0 }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
