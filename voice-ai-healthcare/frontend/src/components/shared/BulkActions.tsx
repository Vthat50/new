import React, { useState } from 'react';
import { Check, X, Mail, Phone, Download, Trash2, Archive, Tag, Users } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAction: (action: string) => void;
  actions?: BulkAction[];
}

interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'danger' | 'success';
  requiresConfirmation?: boolean;
}

export default function BulkActions({ selectedCount, onClearSelection, onAction, actions }: BulkActionsProps) {
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const defaultActions: BulkAction[] = actions || [
    { id: 'email', label: 'Send Email', icon: <Mail style={{ width: '16px', height: '16px' }} /> },
    { id: 'call', label: 'Schedule Call', icon: <Phone style={{ width: '16px', height: '16px' }} /> },
    { id: 'export', label: 'Export', icon: <Download style={{ width: '16px', height: '16px' }} /> },
    { id: 'assign', label: 'Assign To', icon: <Users style={{ width: '16px', height: '16px' }} /> },
    { id: 'tag', label: 'Add Tag', icon: <Tag style={{ width: '16px', height: '16px' }} /> },
    { id: 'archive', label: 'Archive', icon: <Archive style={{ width: '16px', height: '16px' }} /> },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 style={{ width: '16px', height: '16px' }} />,
      variant: 'danger',
      requiresConfirmation: true,
    },
  ];

  const handleAction = (actionId: string, requiresConfirmation?: boolean) => {
    if (requiresConfirmation) {
      setShowConfirm(actionId);
    } else {
      onAction(actionId);
    }
  };

  const handleConfirm = () => {
    if (showConfirm) {
      onAction(showConfirm);
      setShowConfirm(null);
    }
  };

  const handleCancel = () => {
    setShowConfirm(null);
  };

  if (selectedCount === 0) return null;

  return (
    <>
      {/* Bulk Actions Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: spacing[6],
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: colors.neutral[900],
          color: 'white',
          padding: spacing[4],
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[4],
          minWidth: '600px',
        }}
      >
        {/* Selection Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: colors.primary[500],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '32px',
            backgroundColor: 'rgba(255,255,255,0.2)',
          }}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: spacing[2], flex: 1 }}>
          {defaultActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id, action.requiresConfirmation)}
              style={{
                padding: `${spacing[2]} ${spacing[3]}`,
                backgroundColor: action.variant === 'danger' ? colors.status.error : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                transition: 'all 0.2s',
              }}
              className="bulk-action-btn"
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClearSelection}
          style={{
            padding: spacing[2],
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
          }}
          title="Clear selection"
        >
          <X style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing[4],
          }}
          onClick={handleCancel}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: spacing[6],
              maxWidth: '400px',
              width: '100%',
            }}
          >
            <h3
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[2],
              }}
            >
              Confirm Action
            </h3>
            <p
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600],
                marginBottom: spacing[6],
              }}
            >
              Are you sure you want to {showConfirm} {selectedCount} item{selectedCount !== 1 ? 's' : ''}? This action
              cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: `${spacing[2]} ${spacing[4]}`,
                  backgroundColor: 'white',
                  color: colors.neutral[700],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: `${spacing[2]} ${spacing[4]}`,
                  backgroundColor: colors.status.error,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  cursor: 'pointer',
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .bulk-action-btn:hover {
          background-color: rgba(255,255,255,0.2);
        }
      `}</style>
    </>
  );
}
