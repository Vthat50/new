import React, { useState } from 'react';
import { GripVertical, X, Maximize2, Settings, Plus } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface Widget {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  data?: any;
}

interface WidgetSystemProps {
  widgets: Widget[];
  onWidgetUpdate?: (widgets: Widget[]) => void;
  onWidgetRemove?: (widgetId: string) => void;
  onWidgetAdd?: () => void;
}

export default function WidgetSystem({
  widgets: initialWidgets,
  onWidgetUpdate,
  onWidgetRemove,
  onWidgetAdd,
}: WidgetSystemProps) {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const sizeMap = {
    small: { width: '33%', height: '250px' },
    medium: { width: '50%', height: '350px' },
    large: { width: '100%', height: '450px' },
  };

  const handleDragStart = (widgetId: string) => {
    setDraggedWidget(widgetId);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  const handleRemove = (widgetId: string) => {
    const updated = widgets.filter((w) => w.id !== widgetId);
    setWidgets(updated);
    if (onWidgetRemove) {
      onWidgetRemove(widgetId);
    }
  };

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'call-volume':
        return (
          <div style={{ padding: spacing[4], height: '100%' }}>
            <div style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, marginBottom: spacing[2] }}>
              1,247
            </div>
            <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              Total Calls This Month
            </div>
            <div
              style={{
                marginTop: spacing[4],
                height: '60%',
                backgroundColor: colors.primary[100],
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'flex-end',
                gap: spacing[1],
                padding: spacing[2],
              }}
            >
              {[0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 1].map((height, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${height * 100}%`,
                    backgroundColor: colors.primary[500],
                    borderRadius: '2px',
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'sentiment':
        return (
          <div style={{ padding: spacing[4], height: '100%' }}>
            <div style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[4] }}>
              Sentiment Distribution
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              {[
                { label: 'Positive', value: 68, color: colors.status.success },
                { label: 'Neutral', value: 24, color: colors.status.warning },
                { label: 'Negative', value: 8, color: colors.status.error },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[1], fontSize: typography.fontSize.sm }}>
                    <span>{item.label}</span>
                    <span style={{ fontWeight: typography.fontWeight.semibold }}>{item.value}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: colors.neutral[200], borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'top-topics':
        return (
          <div style={{ padding: spacing[4], height: '100%', overflow: 'auto' }}>
            <div style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[4] }}>
              Top Discussion Topics
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              {[
                { topic: 'Refill Requests', count: 342 },
                { topic: 'Prior Authorization', count: 298 },
                { topic: 'Side Effects', count: 156 },
                { topic: 'Insurance Questions', count: 124 },
                { topic: 'Dosage Adjustments', count: 87 },
              ].map((item, i) => (
                <div
                  key={item.topic}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    padding: spacing[2],
                    backgroundColor: colors.neutral[50],
                    borderRadius: '4px',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: colors.primary[500],
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.bold,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, fontSize: typography.fontSize.sm }}>{item.topic}</div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[600] }}>
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div style={{ padding: spacing[4], height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: colors.neutral[500] }}>
              <div style={{ fontSize: typography.fontSize.sm }}>Widget: {widget.type}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Add Widget Button */}
      <div style={{ marginBottom: spacing[4], display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onWidgetAdd}
          style={{
            padding: `${spacing[2]} ${spacing[4]}`,
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
          <Plus style={{ width: '16px', height: '16px' }} />
          Add Widget
        </button>
      </div>

      {/* Widget Grid */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: spacing[4],
          minHeight: '600px',
        }}
      >
        {widgets.map((widget) => {
          const size = sizeMap[widget.size];

          return (
            <div
              key={widget.id}
              draggable
              onDragStart={() => handleDragStart(widget.id)}
              onDragEnd={handleDragEnd}
              style={{
                width: size.width,
                height: size.height,
                border: `1px solid ${draggedWidget === widget.id ? colors.primary[500] : colors.neutral[200]}`,
                borderRadius: '8px',
                backgroundColor: 'white',
                boxShadow: draggedWidget === widget.id ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                opacity: draggedWidget === widget.id ? 0.5 : 1,
                cursor: 'grab',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
              }}
              className="widget"
            >
              {/* Widget Header */}
              <div
                style={{
                  padding: spacing[3],
                  borderBottom: `1px solid ${colors.neutral[200]}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'grab',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                  <GripVertical style={{ width: '16px', height: '16px', color: colors.neutral[400] }} />
                  <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
                    {widget.title}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: spacing[1] }}>
                  <button
                    style={{
                      padding: spacing[1],
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                    title="Settings"
                  >
                    <Settings style={{ width: '14px', height: '14px', color: colors.neutral[600] }} />
                  </button>
                  <button
                    style={{
                      padding: spacing[1],
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                    title="Fullscreen"
                  >
                    <Maximize2 style={{ width: '14px', height: '14px', color: colors.neutral[600] }} />
                  </button>
                  <button
                    onClick={() => handleRemove(widget.id)}
                    style={{
                      padding: spacing[1],
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                    title="Remove"
                  >
                    <X style={{ width: '14px', height: '14px', color: colors.neutral[600] }} />
                  </button>
                </div>
              </div>

              {/* Widget Content */}
              <div style={{ flex: 1, overflow: 'auto' }}>
                {renderWidgetContent(widget)}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {widgets.length === 0 && (
          <div
            style={{
              width: '100%',
              padding: spacing[12],
              textAlign: 'center',
              color: colors.neutral[500],
            }}
          >
            <Plus style={{ width: '64px', height: '64px', margin: '0 auto', marginBottom: spacing[4], opacity: 0.3 }} />
            <div style={{ fontSize: typography.fontSize.lg, marginBottom: spacing[2] }}>No widgets added</div>
            <div style={{ fontSize: typography.fontSize.sm, marginBottom: spacing[4] }}>
              Click "Add Widget" to customize your dashboard
            </div>
          </div>
        )}
      </div>

      <style>{`
        .widget:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}
