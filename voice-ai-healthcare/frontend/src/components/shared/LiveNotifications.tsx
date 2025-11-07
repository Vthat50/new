import React, { useState, useEffect } from 'react';
import { Phone, Users, AlertTriangle, TrendingUp, X } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';
import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates';
import { RealtimeEvent } from '../../services/realtimeService';

interface Notification {
  id: string;
  event: RealtimeEvent;
  isVisible: boolean;
}

export default function LiveNotifications() {
  const { latestEvent } = useRealtimeUpdates('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (latestEvent) {
      const notification: Notification = {
        id: `${latestEvent.type}-${Date.now()}`,
        event: latestEvent,
        isVisible: true,
      };

      setNotifications(prev => [notification, ...prev].slice(0, 3)); // Show max 3

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, isVisible: false } : n)
        );

        // Remove after fade out animation
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 300);
      }, 5000);
    }
  }, [latestEvent]);

  const dismissNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isVisible: false } : n)
    );

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 300);
  };

  const getNotificationContent = (event: RealtimeEvent) => {
    switch (event.type) {
      case 'new_call':
        return {
          icon: Phone,
          color: colors.primary[500],
          bgColor: colors.primary[50],
          title: 'New Call',
          message: `${event.data.direction === 'inbound' ? 'Incoming' : 'Outbound'} call from ${event.data.patientName}`,
          detail: event.data.reason,
        };

      case 'call_completed':
        return {
          icon: Phone,
          color: event.data.resolution === 'resolved' ? colors.status.success : colors.status.warning,
          bgColor: event.data.resolution === 'resolved' ? colors.status.successBg : colors.status.warningBg,
          title: 'Call Completed',
          message: `Call ${event.data.resolution}`,
          detail: `Duration: ${Math.floor(event.data.duration / 60)}m ${event.data.duration % 60}s`,
        };

      case 'patient_updated':
        return {
          icon: Users,
          color: colors.primary[600],
          bgColor: colors.primary[50],
          title: 'Patient Updated',
          message: event.data.patientName,
          detail: `Moved to ${event.data.journeyStage}`,
        };

      case 'friction_detected':
        return {
          icon: AlertTriangle,
          color: event.data.severity === 'critical' ? colors.status.error : colors.status.warning,
          bgColor: event.data.severity === 'critical' ? colors.status.errorBg : colors.status.warningBg,
          title: 'Friction Detected',
          message: event.data.topic,
          detail: `Severity: ${event.data.severity}`,
        };

      case 'metric_update':
        return {
          icon: TrendingUp,
          color: colors.primary[500],
          bgColor: colors.primary[50],
          title: 'Metric Updated',
          message: event.data.metric.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          detail: `${event.data.change > 0 ? '+' : ''}${event.data.change}%`,
        };

      default:
        return {
          icon: TrendingUp,
          color: colors.neutral[500],
          bgColor: colors.neutral[50],
          title: 'Update',
          message: 'System update',
          detail: '',
        };
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: spacing[4],
        right: spacing[4],
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[2],
        maxWidth: '400px',
      }}
    >
      {notifications.map(notification => {
        const content = getNotificationContent(notification.event);
        const Icon = content.icon;

        return (
          <div
            key={notification.id}
            style={{
              backgroundColor: 'white',
              borderLeft: `4px solid ${content.color}`,
              borderRadius: '8px',
              padding: spacing[4],
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              opacity: notification.isVisible ? 1 : 0,
              transform: notification.isVisible ? 'translateX(0)' : 'translateX(100%)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing[3],
            }}
          >
            <div
              className="rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: content.bgColor,
              }}
            >
              <Icon style={{ width: '20px', height: '20px', color: content.color }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between" style={{ marginBottom: spacing[1] }}>
                <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                  {content.title}
                </div>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="flex-shrink-0 hover:bg-neutral-100 rounded transition-colors"
                  style={{ padding: spacing[1], marginLeft: spacing[2] }}
                >
                  <X style={{ width: '14px', height: '14px', color: colors.neutral[400] }} />
                </button>
              </div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700], marginBottom: spacing[1] }}>
                {content.message}
              </div>
              {content.detail && (
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                  {content.detail}
                </div>
              )}
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[400], marginTop: spacing[1] }}>
                {new Date(notification.event.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
