import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface VirtualTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  overscan?: number;
  onRowClick?: (row: T) => void;
  selectedRows?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  getRowId?: (row: T) => string;
}

export default function VirtualTable<T extends Record<string, any>>({
  data,
  columns,
  rowHeight = 56,
  overscan = 3,
  onRowClick,
  selectedRows = new Set(),
  onSelectionChange,
  getRowId = (row) => row.id,
}: VirtualTableProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const handleSort = (key: string) => {
    const column = columns.find((c) => c.key === key);
    if (!column?.sortable) return;

    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (selectedRows.size === data.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map(getRowId)));
    }
  };

  const handleSelectRow = (rowId: string) => {
    if (!onSelectionChange) return;

    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId);
    } else {
      newSelection.add(rowId);
    }
    onSelectionChange(newSelection);
  };

  // Sort data
  const sortedData = [...data];
  if (sortConfig) {
    sortedData.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }

  // Calculate visible range
  const totalHeight = sortedData.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(
    sortedData.length,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
  );
  const visibleData = sortedData.slice(startIndex, endIndex);

  return (
    <div
      style={{
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        backgroundColor: 'white',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          borderBottom: `2px solid ${colors.neutral[200]}`,
          backgroundColor: colors.neutral[50],
        }}
      >
        {onSelectionChange && (
          <div
            style={{
              width: '50px',
              padding: spacing[3],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <input
              type="checkbox"
              checked={selectedRows.size === data.length && data.length > 0}
              onChange={handleSelectAll}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
          </div>
        )}

        {columns.map((column) => (
          <div
            key={column.key}
            onClick={() => handleSort(column.key)}
            style={{
              flex: column.width ? `0 0 ${column.width}` : 1,
              padding: spacing[3],
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[700],
              cursor: column.sortable ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              userSelect: 'none',
            }}
          >
            {column.header}
            {column.sortable && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <ChevronUp
                  style={{
                    width: '12px',
                    height: '12px',
                    color:
                      sortConfig?.key === column.key && sortConfig.direction === 'asc'
                        ? colors.primary[500]
                        : colors.neutral[400],
                    marginBottom: '-4px',
                  }}
                />
                <ChevronDown
                  style={{
                    width: '12px',
                    height: '12px',
                    color:
                      sortConfig?.key === column.key && sortConfig.direction === 'desc'
                        ? colors.primary[500]
                        : colors.neutral[400],
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: '600px',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {/* Spacer for total height */}
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          {/* Visible Rows */}
          <div style={{ position: 'absolute', top: `${startIndex * rowHeight}px`, width: '100%' }}>
            {visibleData.map((row, index) => {
              const rowId = getRowId(row);
              const isSelected = selectedRows.has(rowId);

              return (
                <div
                  key={rowId}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    display: 'flex',
                    height: `${rowHeight}px`,
                    borderBottom: `1px solid ${colors.neutral[200]}`,
                    backgroundColor: isSelected ? colors.primary[50] : index % 2 === 0 ? 'white' : colors.neutral[50],
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.2s',
                  }}
                  className="table-row"
                >
                  {onSelectionChange && (
                    <div
                      style={{
                        width: '50px',
                        padding: spacing[3],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowId)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                    </div>
                  )}

                  {columns.map((column) => (
                    <div
                      key={column.key}
                      style={{
                        flex: column.width ? `0 0 ${column.width}` : 1,
                        padding: spacing[3],
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[900],
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {data.length === 0 && (
          <div
            style={{
              padding: spacing[12],
              textAlign: 'center',
              color: colors.neutral[500],
            }}
          >
            <div style={{ fontSize: typography.fontSize.lg, marginBottom: spacing[2] }}>No data available</div>
            <div style={{ fontSize: typography.fontSize.sm }}>Try adjusting your filters</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: spacing[3],
          borderTop: `1px solid ${colors.neutral[200]}`,
          backgroundColor: colors.neutral[50],
          fontSize: typography.fontSize.sm,
          color: colors.neutral[600],
        }}
      >
        Showing {visibleData.length} of {data.length} rows
        {selectedRows.size > 0 && ` • ${selectedRows.size} selected`}
      </div>

      <style>{`
        .table-row:hover {
          background-color: ${colors.primary[50]} !important;
        }
      `}</style>
    </div>
  );
}
