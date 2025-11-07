import React, { ReactNode, useEffect, useState } from 'react';

interface AnimatedListProps {
  children: ReactNode[];
  staggerDelay?: number;
  animation?: 'fade' | 'slide' | 'scale';
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function AnimatedList({
  children,
  staggerDelay = 50,
  animation = 'fade',
  direction = 'up',
}: AnimatedListProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Stagger the appearance of items
    children.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, index]));
      }, index * staggerDelay);
    });
  }, [children, staggerDelay]);

  const getAnimationStyle = (index: number): React.CSSProperties => {
    const isVisible = visibleItems.has(index);

    let transformFrom = '';
    let transformTo = '';

    switch (animation) {
      case 'slide':
        switch (direction) {
          case 'up':
            transformFrom = 'translateY(20px)';
            break;
          case 'down':
            transformFrom = 'translateY(-20px)';
            break;
          case 'left':
            transformFrom = 'translateX(20px)';
            break;
          case 'right':
            transformFrom = 'translateX(-20px)';
            break;
        }
        transformTo = 'translate(0, 0)';
        break;
      case 'scale':
        transformFrom = 'scale(0.8)';
        transformTo = 'scale(1)';
        break;
      default:
        transformFrom = '';
        transformTo = '';
    }

    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? transformTo : transformFrom,
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    };
  };

  return (
    <>
      {React.Children.map(children, (child, index) => (
        <div key={index} style={getAnimationStyle(index)}>
          {child}
        </div>
      ))}
    </>
  );
}

// Grid variant with staggered animation
interface AnimatedGridProps {
  children: ReactNode[];
  columns?: number;
  gap?: string;
  staggerDelay?: number;
}

export function AnimatedGrid({ children, columns = 3, gap = '16px', staggerDelay = 50 }: AnimatedGridProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    children.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, index]));
      }, index * staggerDelay);
    });
  }, [children, staggerDelay]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {React.Children.map(children, (child, index) => {
        const isVisible = visibleItems.has(index);
        return (
          <div
            key={index}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

// Expandable item with animation
interface AnimatedExpandableProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function AnimatedExpandable({ trigger, children, defaultExpanded = false }: AnimatedExpandableProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [height, setHeight] = useState<number | 'auto'>(defaultExpanded ? 'auto' : 0);
  const contentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  return (
    <div>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        {trigger}
      </div>
      <div
        style={{
          height: height === 'auto' ? 'auto' : `${height}px`,
          overflow: 'hidden',
          transition: 'height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
}

// Counter animation for numbers
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}

export function AnimatedCounter({
  value,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  style,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setCount(easeProgress * value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span style={style}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// Progress bar animation
interface AnimatedProgressProps {
  value: number;
  max?: number;
  height?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: string;
  showLabel?: boolean;
  duration?: number;
}

export function AnimatedProgress({
  value,
  max = 100,
  height = '8px',
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  borderRadius = '4px',
  showLabel = false,
  duration = 500,
}: AnimatedProgressProps) {
  const [currentValue, setCurrentValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(percentage);
    }, 10);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div>
      <div
        style={{
          width: '100%',
          height,
          backgroundColor,
          borderRadius,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${currentValue}%`,
            height: '100%',
            backgroundColor: color,
            transition: `width ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
          }}
        />
      </div>
      {showLabel && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: '#6b7280',
            textAlign: 'right',
          }}
        >
          {Math.round(currentValue)}%
        </div>
      )}
    </div>
  );
}
