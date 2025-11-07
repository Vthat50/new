import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  format?: 'number' | 'currency' | 'percentage';
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export default function AnimatedCounter({
  end,
  duration = 2000,
  format = 'number',
  decimals = 0,
  suffix = '',
  prefix = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function (easeOutQuad)
      const easedProgress = 1 - Math.pow(1 - percentage, 3);

      setCount(end * easedProgress);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  const formatValue = (value: number) => {
    let formatted: string;

    switch (format) {
      case 'currency':
        formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value);
        break;
      case 'percentage':
        formatted = `${value.toFixed(decimals)}%`;
        break;
      default:
        formatted = value.toFixed(decimals);
        if (value >= 1000) {
          formatted = new Intl.NumberFormat('en-US').format(Math.floor(value));
        }
    }

    return `${prefix}${formatted}${suffix}`;
  };

  return <>{formatValue(count)}</>;
}
