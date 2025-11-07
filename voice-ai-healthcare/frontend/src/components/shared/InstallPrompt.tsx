import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showPrompt || localStorage.getItem('installPromptDismissed')) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg"
      style={{
        borderColor: colors.neutral[200],
        padding: spacing[4],
        zIndex: 1000,
      }}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center" style={{ gap: spacing[3] }}>
          <div
            className="rounded-lg flex items-center justify-center"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: colors.primary[50],
            }}
          >
            <Download style={{ width: '24px', height: '24px', color: colors.primary[600] }} />
          </div>
          <div>
            <h3
              className="text-neutral-900"
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[1],
              }}
            >
              Install Voice AI Healthcare
            </h3>
            <p
              className="text-neutral-600"
              style={{ fontSize: typography.fontSize.sm }}
            >
              Install this app for faster access and offline capabilities
            </p>
          </div>
        </div>

        <div className="flex items-center" style={{ gap: spacing[2] }}>
          <button
            onClick={handleDismiss}
            className="hover:bg-neutral-100 rounded transition-colors"
            style={{ padding: spacing[2] }}
          >
            <X style={{ width: '20px', height: '20px', color: colors.neutral[600] }} />
          </button>
          <button
            onClick={handleInstall}
            className="rounded transition-colors"
            style={{
              padding: `${spacing[2]} ${spacing[4]}`,
              backgroundColor: colors.primary[500],
              color: 'white',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary[600];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary[500];
            }}
          >
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}
