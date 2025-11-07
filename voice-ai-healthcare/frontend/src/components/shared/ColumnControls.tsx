import React, { useState } from 'react';
import { Settings, Eye, EyeOff, GripVertical } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface Column {
  id: string;
  label: string;
  visible: boolean;
  width?: number;
}

interface ColumnControlsProps {
  columns: Column[];
  onChange: (columns: Column[]) => void;
}

export default function ColumnControls({ columns: initialColumns, onChange }: ColumnControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [columns, setColumns] = useState(initialColumns);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const toggleColumn = (columnId: string) => {
    const updated = columns.map((col) =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    setColumns(updated);
    onChange(updated);
  };

  const handleDragStart = (columnId: string) => {
    setDraggedItem(columnId);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = columns.findIndex((col) => col.id === draggedItem);
    const targetIndex = columns.findIndex((col) => col.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const reordered = [...columns];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    setColumns(reordered);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    onChange(columns);
  };

  const showAll = () => {
    const updated = columns.map((col) => ({ ...col, visible: true }));
    setColumns(updated);
    onChange(updated);
  };

  const hideAll = () => {
    const updated = columns.map((col) => ({ ...col, visible: false }));
    setColumns(updated);
    onChange(updated);
  };

  const resetToDefault = () => {
    const updated = initialColumns.map((col) => ({ ...col }));
    setColumns(updated);
    onChange(updated);
  };

  const visibleCount = columns.filter((col) => col.visible).length;

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
        }}
      >
        <Settings style={{ width: '16px', height: '16px' }} />
        Columns ({visibleCount}/{columns.length})
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
              width: '320px',
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 999,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: spacing[4],
                borderBottom: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <h3
                style={{
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.semibold,
                  marginBottom: spacing[1],
                }}
              >
                Customize Columns
              </h3>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                Drag to reorder, toggle visibility
              </p>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                padding: spacing[3],
                borderBottom: `1px solid ${colors.neutral[200]}`,
                display: 'flex',
                gap: spacing[2],
              }}
            >
              <button
                onClick={showAll}
                style={{
                  flex: 1,
                  padding: spacing[2],
                  backgroundColor: 'white',
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '4px',
                  fontSize: typography.fontSize.xs,
                  cursor: 'pointer',
                }}
              >
                Show All
              </button>
              <button
                onClick={hideAll}
                style={{
                  flex: 1,
                  padding: spacing[2],
                  backgroundColor: 'white',
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '4px',
                  fontSize: typography.fontSize.xs,
                  cursor: 'pointer',
                }}
              >
                Hide All
              </button>
              <button
                onClick={resetToDefault}
                style={{
                  flex: 1,
                  padding: spacing[2],
                  backgroundColor: 'white',
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '4px',
                  fontSize: typography.fontSize.xs,
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            </div>

            {/* Column List */}
            <div
              style={{
                maxHeight: '400px',
                overflowY: 'auto',
                padding: spacing[2],
              }}
            >
              {columns.map((column) => (
                <div
                  key={column.id}
                  draggable
                  onDragStart={() => handleDragStart(column.id)}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragEnd={handleDragEnd}
                  style={{
                    padding: spacing[3],
                    marginBottom: spacing[2],
                    backgroundColor: draggedItem === column.id ? colors.primary[50] : 'white',
                    border: `1px solid ${colors.neutral[200]}`,
                    borderRadius: '6px',
                    cursor: 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    transition: 'all 0.2s',
                  }}
                  className="column-item"
                >
                  {/* Drag Handle */}
                  <GripVertical
                    style={{
                      width: '16px',
                      height: '16px',
                      color: colors.neutral[400],
                      flexShrink: 0,
                    }}
                  />

                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => toggleColumn(column.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  />

                  {/* Label */}
                  <div
                    style={{
                      flex: 1,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: column.visible ? colors.neutral[900] : colors.neutral[500],
                    }}
                  >
                    {column.label}
                  </div>

                  {/* Visibility Icon */}
                  {column.visible ? (
                    <Eye style={{ width: '14px', height: '14px', color: colors.primary[500], flexShrink: 0 }} />
                  ) : (
                    <EyeOff style={{ width: '14px', height: '14px', color: colors.neutral[400], flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: spacing[3],
                borderTop: `1px solid ${colors.neutral[200]}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                {visibleCount} of {columns.length} visible
              </span>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: `${spacing[2]} ${spacing[4]}`,
                  backgroundColor: colors.primary[500],
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        .column-item:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}
