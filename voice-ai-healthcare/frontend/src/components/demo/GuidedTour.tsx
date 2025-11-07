import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector
  placement: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface GuidedTourProps {
  steps: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function GuidedTour({ steps, isActive, onComplete, onSkip }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isActive) return;

    const step = steps[currentStep];
    if (!step) return;

    const element = document.querySelector(step.target) as HTMLElement;
    setTargetElement(element);

    if (element) {
      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Highlight element
      element.style.position = 'relative';
      element.style.zIndex = '9999';
      element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';

      // Execute step action
      if (step.action) {
        setTimeout(step.action, 500);
      }
    }

    return () => {
      if (element) {
        element.style.boxShadow = '';
        element.style.zIndex = '';
      }
    };
  }, [currentStep, isActive, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCurrentStep(0);
    onComplete();
  };

  const handleSkip = () => {
    setCurrentStep(0);
    onSkip();
  };

  if (!isActive || !steps[currentStep]) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Calculate tooltip position
  const getTooltipPosition = (): React.CSSProperties => {
    if (!targetElement) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = 400;
    const tooltipHeight = 200;
    const offset = 20;

    let top: number;
    let left: number;

    switch (step.placement) {
      case 'top':
        top = rect.top - tooltipHeight - offset;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - offset;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + offset;
        break;
      default:
        top = rect.bottom + offset;
        left = rect.left;
    }

    return {
      position: 'fixed',
      top: `${Math.max(offset, Math.min(top, window.innerHeight - tooltipHeight - offset))}px`,
      left: `${Math.max(offset, Math.min(left, window.innerWidth - tooltipWidth - offset))}px`,
    };
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
        }}
        onClick={handleSkip}
      />

      {/* Tooltip */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...getTooltipPosition(),
          width: '400px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 10000,
        }}
      >
        {/* Header */}
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
            <div
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.neutral[600],
                marginBottom: spacing[1],
              }}
            >
              Step {currentStep + 1} of {steps.length}
            </div>
            <h3
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              {step.title}
            </h3>
          </div>

          <button
            onClick={handleSkip}
            style={{
              padding: spacing[2],
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            <X style={{ width: '20px', height: '20px', color: colors.neutral[400] }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: spacing[4] }}>
          <p
            style={{
              fontSize: typography.fontSize.sm,
              lineHeight: '1.6',
              color: colors.neutral[700],
              marginBottom: spacing[4],
            }}
          >
            {step.content}
          </p>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: '4px',
            backgroundColor: colors.neutral[200],
            borderRadius: '2px',
            overflow: 'hidden',
            margin: `0 ${spacing[4]}`,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: colors.primary[500],
              transition: 'width 0.3s',
            }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: spacing[4],
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={handleSkip}
            style={{
              padding: `${spacing[2]} ${spacing[4]}`,
              border: 'none',
              backgroundColor: 'transparent',
              color: colors.neutral[600],
              fontSize: typography.fontSize.sm,
              cursor: 'pointer',
              borderRadius: '6px',
            }}
          >
            Skip Tour
          </button>

          <div style={{ display: 'flex', gap: spacing[2] }}>
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                style={{
                  padding: `${spacing[2]} ${spacing[4]}`,
                  border: `1px solid ${colors.neutral[300]}`,
                  backgroundColor: 'white',
                  color: colors.neutral[700],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  cursor: 'pointer',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Previous
              </button>
            )}

            <button
              onClick={handleNext}
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                border: 'none',
                backgroundColor: colors.primary[500],
                color: 'white',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Check style={{ width: '16px', height: '16px' }} />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Arrow pointing to target */}
        {targetElement && (
          <div
            style={{
              position: 'absolute',
              ...(step.placement === 'top' && {
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '10px solid white',
              }),
              ...(step.placement === 'bottom' && {
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: '10px solid white',
              }),
              ...(step.placement === 'left' && {
                right: '-10px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderLeft: '10px solid white',
              }),
              ...(step.placement === 'right' && {
                left: '-10px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderRight: '10px solid white',
              }),
            }}
          />
        )}
      </div>

      {/* Step Indicators */}
      <div
        style={{
          position: 'fixed',
          top: spacing[4],
          right: spacing[4],
          display: 'flex',
          gap: spacing[2],
          zIndex: 10000,
        }}
      >
        {steps.map((_, index) => (
          <div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: index === currentStep ? colors.primary[500] : colors.neutral[300],
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </>
  );
}
