import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-white border-b flex items-center justify-center"
      style={{
        borderColor: colors.status.error,
        backgroundColor: colors.status.errorBg,
        padding: spacing[2],
        zIndex: 9999,
      }}
    >
      <div className="flex items-center" style={{ gap: spacing[2] }}>
        <WifiOff style={{ width: '16px', height: '16px', color: colors.status.error }} />
        <span
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.status.error,
          }}
        >
          You are currently offline. Some features may be limited.
        </span>
      </div>
    </div>
  );
}
