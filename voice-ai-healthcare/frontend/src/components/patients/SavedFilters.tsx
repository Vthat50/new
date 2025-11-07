import React, { useState, useEffect } from 'react';
import { Filter, Star, Trash2, Plus, Edit2 } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, any>;
  isFavorite: boolean;
  createdAt: Date;
  count?: number;
}

interface SavedFiltersProps {
  onFilterSelect: (filters: Record<string, any>) => void;
  currentFilters: Record<string, any>;
  onSave: (name: string, filters: Record<string, any>) => void;
}

const STORAGE_KEY = 'pharmai_saved_filters';

export default function SavedFilters({ onFilterSelect, currentFilters, onSave }: SavedFiltersProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadSavedFilters();
  }, []);

  const loadSavedFilters = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const filters = parsed.map((filter: any) => ({
          ...filter,
          createdAt: new Date(filter.createdAt),
        }));
        setSavedFilters(filters);
      }
    } catch (error) {
      console.error('Failed to load saved filters:', error);
    }
  };

  const handleSave = () => {
    if (!filterName.trim()) return;

    const newFilter: SavedFilter = {
      id: editingId || `filter_${Date.now()}`,
      name: filterName,
      filters: currentFilters,
      isFavorite: false,
      createdAt: new Date(),
    };

    let updated;
    if (editingId) {
      updated = savedFilters.map((f) => (f.id === editingId ? newFilter : f));
    } else {
      updated = [...savedFilters, newFilter];
    }

    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    onSave(filterName, currentFilters);

    setFilterName('');
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = savedFilters.map((filter) =>
      filter.id === id ? { ...filter, isFavorite: !filter.isFavorite } : filter
    );
    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = savedFilters.filter((filter) => filter.id !== id);
    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleEdit = (filter: SavedFilter) => {
    setEditingId(filter.id);
    setFilterName(filter.name);
    setIsModalOpen(true);
  };

  const sortedFilters = [...savedFilters].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const favoriteFilters = sortedFilters.filter((f) => f.isFavorite);

  return (
    <>
      {/* Trigger Buttons */}
      <div style={{ display: 'flex', gap: spacing[2], alignItems: 'center' }}>
        <button
          onClick={() => {
            setEditingId(null);
            setFilterName('');
            setIsModalOpen(true);
          }}
          style={{
            padding: `${spacing[2]} ${spacing[3]}`,
            backgroundColor: colors.primary[500],
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing[1],
          }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Save Current Filter
        </button>

        {/* Quick Access Favorites */}
        {favoriteFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterSelect(filter.filters)}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
            }}
          >
            <Star style={{ width: '14px', height: '14px', fill: colors.amber[400], color: colors.amber[400] }} />
            {filter.name}
          </button>
        ))}
      </div>

      {/* Save Modal */}
      {isModalOpen && (
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
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: spacing[6],
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <h3
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[4],
              }}
            >
              {editingId ? 'Edit Filter' : 'Save Filter'}
            </h3>

            {/* Filter Name */}
            <div style={{ marginBottom: spacing[4] }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Filter Name *
              </label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="e.g., High-risk patients needing follow-up"
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              />
            </div>

            {/* Current Filters Preview */}
            <div style={{ marginBottom: spacing[6] }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Active Filters
              </label>
              <div
                style={{
                  padding: spacing[3],
                  backgroundColor: colors.neutral[50],
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              >
                {Object.keys(currentFilters).length === 0 ? (
                  <span style={{ color: colors.neutral[500] }}>No filters applied</span>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
                    {Object.entries(currentFilters).map(([key, value]) => (
                      <div
                        key={key}
                        style={{
                          padding: `${spacing[1]} ${spacing[2]}`,
                          backgroundColor: 'white',
                          border: `1px solid ${colors.neutral[200]}`,
                          borderRadius: '4px',
                          fontSize: typography.fontSize.xs,
                        }}
                      >
                        <strong>{key}:</strong> {JSON.stringify(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Saved Filters List */}
            {!editingId && savedFilters.length > 0 && (
              <div style={{ marginBottom: spacing[6] }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    marginBottom: spacing[3],
                  }}
                >
                  Existing Saved Filters
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], maxHeight: '200px', overflowY: 'auto' }}>
                  {sortedFilters.map((filter) => (
                    <div
                      key={filter.id}
                      style={{
                        padding: spacing[3],
                        border: `1px solid ${colors.neutral[200]}`,
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.medium,
                            marginBottom: spacing[1],
                          }}
                        >
                          {filter.name}
                        </div>
                        <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                          {Object.keys(filter.filters).length} filter{Object.keys(filter.filters).length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: spacing[1] }}>
                        <button
                          onClick={() => handleToggleFavorite(filter.id)}
                          style={{
                            padding: spacing[1],
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: filter.isFavorite ? colors.amber[500] : colors.neutral[400],
                          }}
                          title={filter.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star style={{ width: '16px', height: '16px', fill: filter.isFavorite ? 'currentColor' : 'none' }} />
                        </button>
                        <button
                          onClick={() => handleEdit(filter)}
                          style={{
                            padding: spacing[1],
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: colors.neutral[600],
                          }}
                          title="Edit"
                        >
                          <Edit2 style={{ width: '16px', height: '16px' }} />
                        </button>
                        <button
                          onClick={() => handleDelete(filter.id)}
                          style={{
                            padding: spacing[1],
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: colors.status.error,
                          }}
                          title="Delete"
                        >
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: `${spacing[2]} ${spacing[4]}`,
                  backgroundColor: 'white',
                  color: colors.neutral[700],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!filterName.trim()}
                style={{
                  padding: `${spacing[2]} ${spacing[4]}`,
                  backgroundColor: filterName.trim() ? colors.primary[500] : colors.neutral[300],
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  cursor: filterName.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                {editingId ? 'Update' : 'Save'} Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
