import React, { useState, useEffect } from 'react';
import { Star, X, User, Phone, FileText, BarChart3, Folder } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface FavoriteItem {
  id: string;
  type: 'patient' | 'conversation' | 'report' | 'analytics' | 'saved-view';
  title: string;
  subtitle?: string;
  href: string;
  addedAt: Date;
}

interface FavoritesProps {
  maxItems?: number;
  onNavigate?: (href: string) => void;
}

const STORAGE_KEY = 'pharmai_favorites';

const getIcon = (type: FavoriteItem['type']) => {
  const iconProps = { width: '16px', height: '16px' };
  switch (type) {
    case 'patient':
      return <User {...iconProps} />;
    case 'conversation':
      return <Phone {...iconProps} />;
    case 'report':
      return <FileText {...iconProps} />;
    case 'analytics':
      return <BarChart3 {...iconProps} />;
    case 'saved-view':
      return <Folder {...iconProps} />;
  }
};

const getTypeLabel = (type: FavoriteItem['type']) => {
  switch (type) {
    case 'patient':
      return 'Patient';
    case 'conversation':
      return 'Conversation';
    case 'report':
      return 'Report';
    case 'analytics':
      return 'Analytics';
    case 'saved-view':
      return 'Saved View';
  }
};

export default function Favorites({ maxItems = 20, onNavigate }: FavoritesProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<FavoriteItem['type'] | 'all'>('all');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const items = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        setFavorites(items);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const handleNavigate = (item: FavoriteItem) => {
    if (onNavigate) {
      onNavigate(item.href);
    } else {
      window.location.href = item.href;
    }
    setIsOpen(false);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const filteredFavorites = filter === 'all'
    ? favorites
    : favorites.filter((item) => item.type === filter);

  const favoritesByType = favorites.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<FavoriteItem['type'], number>);

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
        <Star style={{ width: '16px', height: '16px' }} />
        Favorites ({favorites.length})
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
              maxHeight: '600px',
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
              }}
            >
              <h3
                style={{
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.semibold,
                  margin: 0,
                  marginBottom: spacing[3],
                }}
              >
                Favorites
              </h3>

              {/* Filter Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: spacing[1],
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() => setFilter('all')}
                  style={{
                    padding: `${spacing[1]} ${spacing[2]}`,
                    backgroundColor: filter === 'all' ? colors.primary[500] : 'white',
                    color: filter === 'all' ? 'white' : colors.neutral[600],
                    border: `1px solid ${filter === 'all' ? colors.primary[500] : colors.neutral[300]}`,
                    borderRadius: '4px',
                    fontSize: typography.fontSize.xs,
                    cursor: 'pointer',
                  }}
                >
                  All ({favorites.length})
                </button>
                {(['patient', 'conversation', 'report', 'analytics', 'saved-view'] as const).map((type) => {
                  const count = favoritesByType[type] || 0;
                  if (count === 0) return null;
                  return (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      style={{
                        padding: `${spacing[1]} ${spacing[2]}`,
                        backgroundColor: filter === type ? colors.primary[500] : 'white',
                        color: filter === type ? 'white' : colors.neutral[600],
                        border: `1px solid ${filter === type ? colors.primary[500] : colors.neutral[300]}`,
                        borderRadius: '4px',
                        fontSize: typography.fontSize.xs,
                        cursor: 'pointer',
                      }}
                    >
                      {getTypeLabel(type)} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Items List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
              }}
            >
              {filteredFavorites.length === 0 ? (
                <div
                  style={{
                    padding: spacing[6],
                    textAlign: 'center',
                    color: colors.neutral[500],
                    fontSize: typography.fontSize.sm,
                  }}
                >
                  No favorites yet. Click the star icon on any item to add it here.
                </div>
              ) : (
                filteredFavorites.slice(0, maxItems).map((item) => (
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
                    className="favorite-item"
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
                          fontSize: typography.fontSize.xs,
                          color: colors.neutral[500],
                        }}
                      >
                        {getTypeLabel(item.type)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => handleRemove(item.id, e)}
                      style={{
                        padding: spacing[1],
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: colors.amber[500],
                        flexShrink: 0,
                      }}
                      title="Remove from favorites"
                    >
                      <Star style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        .favorite-item:hover {
          background-color: ${colors.neutral[50]};
        }
      `}</style>
    </div>
  );
}

// Hook to manage favorites
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const items = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        setFavorites(items);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const isFavorite = (id: string): boolean => {
    return favorites.some((item) => item.id === id);
  };

  const toggleFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    try {
      let updated: FavoriteItem[];

      if (isFavorite(item.id)) {
        // Remove from favorites
        updated = favorites.filter((fav) => fav.id !== item.id);
      } else {
        // Add to favorites
        updated = [
          ...favorites,
          {
            ...item,
            addedAt: new Date(),
          },
        ];
      }

      setFavorites(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return { favorites, isFavorite, toggleFavorite };
}

// Star button component for easy toggling
interface FavoriteStarProps {
  id: string;
  type: FavoriteItem['type'];
  title: string;
  subtitle?: string;
  href: string;
}

export function FavoriteStar({ id, type, title, subtitle, href }: FavoriteStarProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(id);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite({ id, type, title, subtitle, href });
      }}
      style={{
        padding: spacing[1],
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: isFav ? colors.amber[500] : colors.neutral[400],
        transition: 'color 0.2s',
      }}
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
      className="favorite-star-btn"
    >
      <Star
        style={{
          width: '18px',
          height: '18px',
          fill: isFav ? 'currentColor' : 'none',
        }}
      />
      <style>{`
        .favorite-star-btn:hover {
          color: ${colors.amber[500]};
        }
      `}</style>
    </button>
  );
}
