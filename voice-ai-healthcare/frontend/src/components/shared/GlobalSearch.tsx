import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Phone, FileText, Calendar, TrendingUp } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface SearchResult {
  id: string;
  type: 'patient' | 'conversation' | 'document' | 'appointment' | 'insight';
  title: string;
  subtitle: string;
  metadata?: string;
  score: number;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (result: SearchResult) => void;
}

export default function GlobalSearch({ isOpen, onClose, onResultClick }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);

      // Simulate search API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'patient',
          title: 'John Smith',
          subtitle: 'DOB: 03/15/1975 • ID: PT-12345',
          metadata: 'Active - On Medication',
          score: 0.95,
        },
        {
          id: '2',
          type: 'conversation',
          title: 'Call with Sarah Johnson',
          subtitle: 'Yesterday at 2:30 PM',
          metadata: 'Duration: 8m 32s • Resolved',
          score: 0.88,
        },
        {
          id: '3',
          type: 'document',
          title: 'Prior Authorization Form - John Smith',
          subtitle: 'Uploaded: Jan 15, 2025',
          metadata: 'PDF • 2.3 MB',
          score: 0.82,
        },
        {
          id: '4',
          type: 'appointment',
          title: 'Follow-up Call - Michael Chen',
          subtitle: 'Tomorrow at 10:00 AM',
          metadata: 'Refill Reminder',
          score: 0.75,
        },
        {
          id: '5',
          type: 'insight',
          title: 'High Churn Risk - West Region',
          subtitle: 'Generated: Today',
          metadata: '23 patients identified',
          score: 0.68,
        },
      ].filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(query.toLowerCase())
      );

      setResults(mockResults);
      setIsSearching(false);
      setSelectedIndex(0);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result);
    setQuery('');
    setResults([]);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'patient':
        return <User style={{ width: '20px', height: '20px', color: colors.primary[500] }} />;
      case 'conversation':
        return <Phone style={{ width: '20px', height: '20px', color: colors.status.success }} />;
      case 'document':
        return <FileText style={{ width: '20px', height: '20px', color: colors.status.warning }} />;
      case 'appointment':
        return <Calendar style={{ width: '20px', height: '20px', color: colors.primary[600] }} />;
      case 'insight':
        return <TrendingUp style={{ width: '20px', height: '20px', color: colors.status.error }} />;
      default:
        return <Search style={{ width: '20px', height: '20px', color: colors.neutral[400] }} />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        padding: spacing[12],
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '700px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Search Input */}
        <div
          style={{
            padding: spacing[4],
            borderBottom: `1px solid ${colors.neutral[200]}`,
            display: 'flex',
            alignItems: 'center',
            gap: spacing[3],
          }}
        >
          <Search style={{ width: '24px', height: '24px', color: colors.neutral[400] }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search patients, calls, documents..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: typography.fontSize.lg,
              color: colors.neutral[900],
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                padding: spacing[1],
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              <X style={{ width: '20px', height: '20px', color: colors.neutral[400] }} />
            </button>
          )}
        </div>

        {/* Results */}
        <div
          style={{
            maxHeight: '500px',
            overflowY: 'auto',
          }}
        >
          {isSearching && (
            <div
              style={{
                padding: spacing[8],
                textAlign: 'center',
                color: colors.neutral[500],
              }}
            >
              <div style={{ fontSize: typography.fontSize.sm }}>Searching...</div>
            </div>
          )}

          {!isSearching && query && results.length === 0 && (
            <div
              style={{
                padding: spacing[8],
                textAlign: 'center',
                color: colors.neutral[500],
              }}
            >
              <div style={{ fontSize: typography.fontSize.md, marginBottom: spacing[2] }}>No results found</div>
              <div style={{ fontSize: typography.fontSize.sm }}>
                Try searching for patient names, call IDs, or documents
              </div>
            </div>
          )}

          {!isSearching && !query && (
            <div
              style={{
                padding: spacing[8],
                textAlign: 'center',
                color: colors.neutral[500],
              }}
            >
              <Search style={{ width: '48px', height: '48px', margin: '0 auto', marginBottom: spacing[4], opacity: 0.3 }} />
              <div style={{ fontSize: typography.fontSize.md, marginBottom: spacing[2] }}>Start typing to search</div>
              <div style={{ fontSize: typography.fontSize.sm }}>
                Patients • Conversations • Documents • Appointments • Insights
              </div>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div>
              {results.map((result, index) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    padding: spacing[4],
                    borderBottom: `1px solid ${colors.neutral[200]}`,
                    backgroundColor: index === selectedIndex ? colors.primary[50] : 'white',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', gap: spacing[3] }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: index === selectedIndex ? colors.primary[100] : colors.neutral[100],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {getIcon(result.type)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing[2],
                          marginBottom: spacing[1],
                        }}
                      >
                        <span
                          style={{
                            fontSize: typography.fontSize.md,
                            fontWeight: typography.fontWeight.semibold,
                            color: colors.neutral[900],
                          }}
                        >
                          {result.title}
                        </span>
                        <span
                          style={{
                            padding: `${spacing[0.5]} ${spacing[2]}`,
                            backgroundColor: colors.neutral[200],
                            color: colors.neutral[700],
                            borderRadius: '12px',
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.medium,
                          }}
                        >
                          {getTypeLabel(result.type)}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.neutral[600],
                          marginBottom: spacing[1],
                        }}
                      >
                        {result.subtitle}
                      </div>

                      {result.metadata && (
                        <div
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral[500],
                          }}
                        >
                          {result.metadata}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: spacing[3],
            borderTop: `1px solid ${colors.neutral[200]}`,
            backgroundColor: colors.neutral[50],
            display: 'flex',
            gap: spacing[4],
            fontSize: typography.fontSize.xs,
            color: colors.neutral[600],
          }}
        >
          <div>
            <kbd style={{ padding: `${spacing[0.5]} ${spacing[1]}`, backgroundColor: 'white', border: `1px solid ${colors.neutral[300]}`, borderRadius: '4px', fontFamily: 'monospace' }}>
              ↑↓
            </kbd>{' '}
            Navigate
          </div>
          <div>
            <kbd style={{ padding: `${spacing[0.5]} ${spacing[1]}`, backgroundColor: 'white', border: `1px solid ${colors.neutral[300]}`, borderRadius: '4px', fontFamily: 'monospace' }}>
              Enter
            </kbd>{' '}
            Select
          </div>
          <div>
            <kbd style={{ padding: `${spacing[0.5]} ${spacing[1]}`, backgroundColor: 'white', border: `1px solid ${colors.neutral[300]}`, borderRadius: '4px', fontFamily: 'monospace' }}>
              Esc
            </kbd>{' '}
            Close
          </div>
        </div>
      </div>
    </div>
  );
}
