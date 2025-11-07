import React, { useState } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onAction?: (notification: Notification) => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onAction,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    const iconProps = { width: '18px', height: '18px' };
    switch (type) {
      case 'info':
        return <Info {...iconProps} />;
      case 'success':
        return <CheckCircle {...iconProps} />;
      case 'warning':
        return <AlertCircle {...iconProps} />;
      case 'error':
        return <AlertCircle {...iconProps} />;
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return colors.primary[500];
      case 'success':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      case 'error':
        return colors.status.error;
    }
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

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: spacing[2],
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[300]}`,
          borderRadius: '6px',
          cursor: 'pointer',
          color: colors.neutral[700],
        }}
      >
        <Bell style={{ width: '20px', height: '20px' }} />
        {unreadCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: colors.status.error,
              color: 'white',
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.bold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
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

          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: spacing[2],
              width: '400px',
              maxHeight: '600px',
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
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
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  style={{
                    padding: `${spacing[1]} ${spacing[2]}`,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: colors.primary[600],
                    fontSize: typography.fontSize.sm,
                    cursor: 'pointer',
                    fontWeight: typography.fontWeight.medium,
                  }}
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
              }}
            >
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: spacing[8],
                    textAlign: 'center',
                    color: colors.neutral[500],
                  }}
                >
                  <Bell
                    style={{
                      width: '48px',
                      height: '48px',
                      margin: '0 auto',
                      marginBottom: spacing[3],
                      opacity: 0.3,
                    }}
                  />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: spacing[4],
                      borderBottom: `1px solid ${colors.neutral[100]}`,
                      backgroundColor: notification.read ? 'white' : colors.primary[25],
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    className="notification-item"
                    onClick={() => !notification.read && onMarkAsRead(notification.id)}
                  >
                    <div style={{ display: 'flex', gap: spacing[3] }}>
                      {/* Icon */}
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: `${getColor(notification.type)}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: getColor(notification.type),
                          flexShrink: 0,
                        }}
                      >
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.semibold,
                            marginBottom: spacing[1],
                          }}
                        >
                          {notification.title}
                        </div>
                        <div
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.neutral[600],
                            marginBottom: spacing[2],
                          }}
                        >
                          {notification.message}
                        </div>
                        <div
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral[500],
                          }}
                        >
                          {formatTimestamp(notification.timestamp)}
                        </div>

                        {/* Action Button */}
                        {notification.actionLabel && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onAction) onAction(notification);
                            }}
                            style={{
                              marginTop: spacing[2],
                              padding: `${spacing[1]} ${spacing[3]}`,
                              backgroundColor: colors.primary[500],
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: typography.fontSize.xs,
                              fontWeight: typography.fontWeight.medium,
                              cursor: 'pointer',
                            }}
                          >
                            {notification.actionLabel}
                          </button>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(notification.id);
                            }}
                            style={{
                              padding: spacing[1],
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: colors.neutral[400],
                            }}
                            title="Mark as read"
                          >
                            <Check style={{ width: '16px', height: '16px' }} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDismiss(notification.id);
                          }}
                          style={{
                            padding: spacing[1],
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: colors.neutral[400],
                          }}
                          title="Dismiss"
                        >
                          <X style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <style>{`
            .notification-item:hover {
              background-color: ${colors.neutral[50]};
            }
          `}</style>
        </>
      )}
    </div>
  );
}
