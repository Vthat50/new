import React, { useState, useEffect } from 'react';
import { Clock, X, User, Phone, FileText, Settings } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface RecentItem {
  id: string;
  type: 'patient' | 'conversation' | 'report' | 'config';
  title: string;
  subtitle?: string;
  timestamp: Date;
  href: string;
}

interface RecentlyViewedProps {
  maxItems?: number;
  onNavigate?: (href: string) => void;
  onClear?: () => void;
}

const STORAGE_KEY = 'pharmai_recently_viewed';

const getIcon = (type: RecentItem['type']) => {
  const iconProps = { width: '16px', height: '16px' };
  switch (type) {
    case 'patient':
      return <User {...iconProps} />;
    case 'conversation':
      return <Phone {...iconProps} />;
    case 'report':
      return <FileText {...iconProps} />;
    case 'config':
      return <Settings {...iconProps} />;
  }
};

const getTypeLabel = (type: RecentItem['type']) => {
  switch (type) {
    case 'patient':
      return 'Patient';
    case 'conversation':
      return 'Conversation';
    case 'report':
      return 'Report';
    case 'config':
      return 'Configuration';
  }
};

export default function RecentlyViewed({ maxItems = 10, onNavigate, onClear }: RecentlyViewedProps) {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadRecentItems();
  }, []);

  const loadRecentItems = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const items = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setRecentItems(items);
      }
    } catch (error) {
      console.error('Failed to load recent items:', error);
    }
  };

  const handleNavigate = (item: RecentItem) => {
    if (onNavigate) {
      onNavigate(item.href);
    } else {
      window.location.href = item.href;
    }
    setIsOpen(false);
  };

  const handleClearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentItems([]);
    if (onClear) {
      onClear();
    }
  };

  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentItems.filter((item) => item.id !== id);
    setRecentItems(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (recentItems.length === 0) return null;

  return (
    <div style={{ position: 'relative' }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: `${spacing[2]} ${spacing[3]}`,
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[300]}`,
          borderRadius: '6px',
          fontSize: typography.fontSize.sm,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          color: colors.neutral[700],
        }}
      >
        <Clock style={{ width: '16px', height: '16px' }} />
        Recently Viewed
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998,
            }}
          />

          {/* Panel */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: spacing[2],
              width: '400px',
              maxHeight: '500px',
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 999,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
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
              <h3
                style={{
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.semibold,
                  margin: 0,
                }}
              >
                Recently Viewed
              </h3>
              <button
                onClick={handleClearAll}
                style={{
                  padding: `${spacing[1]} ${spacing[2]}`,
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '4px',
                  fontSize: typography.fontSize.xs,
                  cursor: 'pointer',
                  color: colors.neutral[600],
                }}
              >
                Clear All
              </button>
            </div>

            {/* Items List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
              }}
            >
              {recentItems.slice(0, maxItems).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(item)}
                  style={{
                    padding: spacing[3],
                    borderBottom: `1px solid ${colors.neutral[100]}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: spacing[3],
                    transition: 'background-color 0.2s',
                  }}
                  className="recent-item"
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: colors.primary[50],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.primary[600],
                      flexShrink: 0,
                    }}
                  >
                    {getIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.neutral[900],
                        marginBottom: spacing[1],
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.neutral[600],
                          marginBottom: spacing[1],
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.subtitle}
                      </div>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing[2],
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[500],
                      }}
                    >
                      <span>{getTypeLabel(item.type)}</span>
                      <span>•</span>
                      <span>{formatTimestamp(item.timestamp)}</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemoveItem(item.id, e)}
                    style={{
                      padding: spacing[1],
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: colors.neutral[400],
                      flexShrink: 0,
                    }}
                    title="Remove"
                  >
                    <X style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        .recent-item:hover {
          background-color: ${colors.neutral[50]};
        }
      `}</style>
    </div>
  );
}

// Hook to add items to recently viewed
export function useRecentlyViewed() {
  const addRecentItem = (item: Omit<RecentItem, 'timestamp'>) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let items: RecentItem[] = stored ? JSON.parse(stored) : [];

      // Remove if already exists
      items = items.filter((i) => i.id !== item.id);

      // Add to beginning
      items.unshift({
        ...item,
        timestamp: new Date(),
      });

      // Keep only last 50 items
      items = items.slice(0, 50);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to add recent item:', error);
    }
  };

  return { addRecentItem };
}
