import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to error reporting service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // In production, send to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
      console.log('Would log to error service:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.neutral[50],
            padding: spacing[4],
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: spacing[8],
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: colors.status.errorBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: spacing[4],
              }}
            >
              <AlertTriangle style={{ width: '32px', height: '32px', color: colors.status.error }} />
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                textAlign: 'center',
                marginBottom: spacing[2],
              }}
            >
              Something went wrong
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: typography.fontSize.md,
                color: colors.neutral[600],
                textAlign: 'center',
                marginBottom: spacing[6],
              }}
            >
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details
                style={{
                  marginBottom: spacing[6],
                  padding: spacing[4],
                  backgroundColor: colors.neutral[50],
                  borderRadius: '8px',
                  border: `1px solid ${colors.neutral[200]}`,
                }}
              >
                <summary
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    cursor: 'pointer',
                    marginBottom: spacing[2],
                  }}
                >
                  Error Details
                </summary>
                <div
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    color: colors.status.error,
                    marginBottom: spacing[2],
                  }}
                >
                  {this.state.error.toString()}
                </div>
                {this.state.errorInfo && (
                  <div
                    style={{
                      fontSize: typography.fontSize.xs,
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      color: colors.neutral[600],
                      maxHeight: '200px',
                      overflow: 'auto',
                    }}
                  >
                    {this.state.errorInfo.componentStack}
                  </div>
                )}
              </details>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: `${spacing[3]} ${spacing[6]}`,
                  backgroundColor: colors.primary[500],
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                <RefreshCw style={{ width: '16px', height: '16px' }} />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  padding: `${spacing[3]} ${spacing[6]}`,
                  backgroundColor: 'white',
                  color: colors.neutral[700],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                <Home style={{ width: '16px', height: '16px' }} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for convenience
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
