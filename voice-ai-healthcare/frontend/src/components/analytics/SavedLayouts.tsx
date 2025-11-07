import React, { useState, useEffect } from 'react';
import { Save, Trash2, Star, Clock, Layout } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: any[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SavedLayoutsProps {
  currentLayout: any[];
  onLoadLayout: (layout: any[]) => void;
  onSaveLayout: (name: string, description?: string) => void;
}

const STORAGE_KEY = 'pharmai_saved_layouts';

export default function SavedLayouts({ currentLayout, onLoadLayout, onSaveLayout }: SavedLayoutsProps) {
  const [layouts, setLayouts] = useState<DashboardLayout[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [layoutDescription, setLayoutDescription] = useState('');

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const layouts = parsed.map((layout: any) => ({
          ...layout,
          createdAt: new Date(layout.createdAt),
          updatedAt: new Date(layout.updatedAt),
        }));
        setLayouts(layouts);
      }
    } catch (error) {
      console.error('Failed to load layouts:', error);
    }
  };

  const handleSave = () => {
    if (!layoutName.trim()) return;

    const newLayout: DashboardLayout = {
      id: `layout_${Date.now()}`,
      name: layoutName,
      description: layoutDescription,
      widgets: currentLayout,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = [...layouts, newLayout];
    setLayouts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    onSaveLayout(layoutName, layoutDescription);
    setLayoutName('');
    setLayoutDescription('');
    setIsSaveModalOpen(false);
  };

  const handleLoad = (layout: DashboardLayout) => {
    onLoadLayout(layout.widgets);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = layouts.filter((layout) => layout.id !== id);
    setLayouts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleToggleFavorite = (id: string) => {
    const updated = layouts.map((layout) =>
      layout.id === id ? { ...layout, isFavorite: !layout.isFavorite } : layout
    );
    setLayouts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const formatDate = (date: Date) => {
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

  const sortedLayouts = [...layouts].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  return (
    <>
      {/* Trigger Buttons */}
      <div style={{ display: 'flex', gap: spacing[2] }}>
        <button
          onClick={() => setIsSaveModalOpen(true)}
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
          }}
        >
          <Save style={{ width: '16px', height: '16px' }} />
          Save Layout
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
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
          }}
        >
          <Layout style={{ width: '16px', height: '16px' }} />
          Saved Layouts ({layouts.length})
        </button>
      </div>

      {/* Save Modal */}
      {isSaveModalOpen && (
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
          onClick={() => setIsSaveModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: spacing[6],
              maxWidth: '500px',
              width: '100%',
            }}
          >
            <h3
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[4],
              }}
            >
              Save Dashboard Layout
            </h3>

            <div style={{ marginBottom: spacing[4] }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Layout Name *
              </label>
              <input
                type="text"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                placeholder="e.g., Q4 Performance Dashboard"
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              />
            </div>

            <div style={{ marginBottom: spacing[6] }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Description (Optional)
              </label>
              <textarea
                value={layoutDescription}
                onChange={(e) => setLayoutDescription(e.target.value)}
                placeholder="Brief description of this layout..."
                rows={3}
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsSaveModalOpen(false)}
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
                onClick={handleSave}
                disabled={!layoutName.trim()}
                style={{
                  padding: `${spacing[2]} ${spacing[4]}`,
                  backgroundColor: layoutName.trim() ? colors.primary[500] : colors.neutral[300],
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  cursor: layoutName.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Save Layout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Layouts List Modal */}
      {isModalOpen && (
        <>
          <div
            onClick={() => setIsModalOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10000,
            }}
          />

          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '700px',
              maxHeight: '80vh',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              zIndex: 10001,
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: spacing[6],
                borderBottom: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <h3
                style={{
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  marginBottom: spacing[1],
                }}
              >
                Saved Layouts
              </h3>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                Load a previously saved dashboard configuration
              </p>
            </div>

            {/* Layouts List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: spacing[4],
              }}
            >
              {sortedLayouts.length === 0 ? (
                <div
                  style={{
                    padding: spacing[8],
                    textAlign: 'center',
                    color: colors.neutral[500],
                  }}
                >
                  <Layout
                    style={{
                      width: '48px',
                      height: '48px',
                      margin: '0 auto',
                      marginBottom: spacing[3],
                      opacity: 0.3,
                    }}
                  />
                  <p>No saved layouts yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
                  {sortedLayouts.map((layout) => (
                    <div
                      key={layout.id}
                      style={{
                        padding: spacing[4],
                        border: `1px solid ${colors.neutral[200]}`,
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                      }}
                      className="layout-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[3] }}>
                        {/* Icon */}
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '8px',
                            backgroundColor: colors.primary[50],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.primary[600],
                            flexShrink: 0,
                          }}
                        >
                          <Layout style={{ width: '24px', height: '24px' }} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[1] }}>
                            <h4
                              style={{
                                fontSize: typography.fontSize.md,
                                fontWeight: typography.fontWeight.semibold,
                              }}
                            >
                              {layout.name}
                            </h4>
                            {layout.isFavorite && (
                              <Star
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  fill: colors.amber[400],
                                  color: colors.amber[400],
                                }}
                              />
                            )}
                          </div>

                          {layout.description && (
                            <p
                              style={{
                                fontSize: typography.fontSize.sm,
                                color: colors.neutral[600],
                                marginBottom: spacing[2],
                              }}
                            >
                              {layout.description}
                            </p>
                          )}

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: spacing[3],
                              fontSize: typography.fontSize.xs,
                              color: colors.neutral[500],
                              marginBottom: spacing[3],
                            }}
                          >
                            <span>{layout.widgets.length} widgets</span>
                            <span>•</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                              <Clock style={{ width: '12px', height: '12px' }} />
                              {formatDate(layout.updatedAt)}
                            </span>
                          </div>

                          {/* Actions */}
                          <div style={{ display: 'flex', gap: spacing[2] }}>
                            <button
                              onClick={() => handleLoad(layout)}
                              style={{
                                padding: `${spacing[2]} ${spacing[3]}`,
                                backgroundColor: colors.primary[500],
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: typography.fontSize.sm,
                                fontWeight: typography.fontWeight.medium,
                                cursor: 'pointer',
                              }}
                            >
                              Load Layout
                            </button>
                            <button
                              onClick={() => handleToggleFavorite(layout.id)}
                              style={{
                                padding: spacing[2],
                                backgroundColor: 'white',
                                border: `1px solid ${colors.neutral[300]}`,
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: layout.isFavorite ? colors.amber[500] : colors.neutral[400],
                              }}
                              title={layout.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Star style={{ width: '16px', height: '16px', fill: layout.isFavorite ? 'currentColor' : 'none' }} />
                            </button>
                            <button
                              onClick={() => handleDelete(layout.id)}
                              style={{
                                padding: spacing[2],
                                backgroundColor: 'white',
                                border: `1px solid ${colors.neutral[300]}`,
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: colors.status.error,
                              }}
                              title="Delete layout"
                            >
                              <Trash2 style={{ width: '16px', height: '16px' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <style>{`
            .layout-card:hover {
              border-color: ${colors.primary[300]};
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
          `}</style>
        </>
      )}
    </>
  );
}
