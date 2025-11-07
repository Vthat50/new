import React, { ReactNode } from 'react';

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <div
      className={className}
      style={{
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {children}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Slide transition variant
export function SlidePage({ children, className, direction = 'right' }: AnimatedPageProps & { direction?: 'left' | 'right' }) {
  const translateFrom = direction === 'right' ? '20px' : '-20px';

  return (
    <div
      className={className}
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      {children}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(${translateFrom});
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

// Scale transition variant
export function ScalePage({ children, className }: AnimatedPageProps) {
  return (
    <div
      className={className}
      style={{
        animation: 'scaleIn 0.3s ease-out',
      }}
    >
      {children}

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
