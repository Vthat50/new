import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Clock, Star } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface Command {
  id: string;
  label: string;
  category: string;
  icon?: React.ReactNode;
  keywords?: string[];
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

export default function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);

  useEffect(() => {
    // Load recent commands from localStorage
    const stored = localStorage.getItem('recent_commands');
    if (stored) {
      setRecentCommands(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, searchQuery]);

  const filteredCommands = commands.filter((command) => {
    const query = searchQuery.toLowerCase();
    return (
      command.label.toLowerCase().includes(query) ||
      command.category.toLowerCase().includes(query) ||
      command.keywords?.some((k) => k.toLowerCase().includes(query))
    );
  });

  const executeCommand = (command: Command) => {
    // Add to recent commands
    const updated = [command.id, ...recentCommands.filter((id) => id !== command.id)].slice(0, 5);
    setRecentCommands(updated);
    localStorage.setItem('recent_commands', JSON.stringify(updated));

    command.action();
    onClose();
  };

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  const recentCommandObjects = commands.filter((c) => recentCommands.includes(c.id));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
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
        }}
      />

      {/* Command Palette */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          maxWidth: '90vw',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 10001,
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
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
          <Search style={{ width: '20px', height: '20px', color: colors.neutral[400] }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: typography.fontSize.md,
              backgroundColor: 'transparent',
            }}
          />
          <kbd
            style={{
              padding: `${spacing[1]} ${spacing[2]}`,
              backgroundColor: colors.neutral[100],
              borderRadius: '4px',
              fontSize: typography.fontSize.xs,
              fontFamily: 'monospace',
              color: colors.neutral[600],
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {/* Recent Commands */}
          {searchQuery === '' && recentCommandObjects.length > 0 && (
            <div>
              <div
                style={{
                  padding: `${spacing[2]} ${spacing[4]}`,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[500],
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Recent
              </div>
              {recentCommandObjects.map((command, index) => (
                <button
                  key={command.id}
                  onClick={() => executeCommand(command)}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    backgroundColor: selectedIndex === index ? colors.neutral[50] : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[3],
                    textAlign: 'left',
                    transition: 'background-color 0.2s',
                  }}
                  className="command-item"
                >
                  <Clock style={{ width: '18px', height: '18px', color: colors.neutral[400], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                      {command.label}
                    </div>
                  </div>
                  <ArrowRight style={{ width: '16px', height: '16px', color: colors.neutral[400], flexShrink: 0 }} />
                </button>
              ))}
            </div>
          )}

          {/* Grouped Commands */}
          {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
            <div key={category}>
              <div
                style={{
                  padding: `${spacing[2]} ${spacing[4]}`,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[500],
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {category}
              </div>
              {categoryCommands.map((command, catIndex) => {
                const globalIndex = filteredCommands.findIndex((c) => c.id === command.id);
                return (
                  <button
                    key={command.id}
                    onClick={() => executeCommand(command)}
                    style={{
                      width: '100%',
                      padding: spacing[3],
                      backgroundColor: selectedIndex === globalIndex ? colors.neutral[50] : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[3],
                      textAlign: 'left',
                      transition: 'background-color 0.2s',
                    }}
                    className="command-item"
                  >
                    {command.icon && (
                      <div style={{ width: '18px', height: '18px', color: colors.neutral[600], flexShrink: 0 }}>
                        {command.icon}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                        {command.label}
                      </div>
                    </div>
                    {command.shortcut && (
                      <kbd
                        style={{
                          padding: `${spacing[1]} ${spacing[2]}`,
                          backgroundColor: colors.neutral[100],
                          borderRadius: '4px',
                          fontSize: typography.fontSize.xs,
                          fontFamily: 'monospace',
                          color: colors.neutral[600],
                          flexShrink: 0,
                        }}
                      >
                        {command.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* No Results */}
          {filteredCommands.length === 0 && (
            <div
              style={{
                padding: spacing[8],
                textAlign: 'center',
                color: colors.neutral[500],
              }}
            >
              No commands found
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: spacing[3],
            borderTop: `1px solid ${colors.neutral[200]}`,
            display: 'flex',
            gap: spacing[4],
            fontSize: typography.fontSize.xs,
            color: colors.neutral[600],
          }}
        >
          <div>
            <kbd style={{ padding: `${spacing[1]} ${spacing[2]}`, backgroundColor: colors.neutral[100], borderRadius: '4px', fontFamily: 'monospace' }}>
              ↑↓
            </kbd>{' '}
            Navigate
          </div>
          <div>
            <kbd style={{ padding: `${spacing[1]} ${spacing[2]}`, backgroundColor: colors.neutral[100], borderRadius: '4px', fontFamily: 'monospace' }}>
              ↵
            </kbd>{' '}
            Execute
          </div>
          <div>
            <kbd style={{ padding: `${spacing[1]} ${spacing[2]}`, backgroundColor: colors.neutral[100], borderRadius: '4px', fontFamily: 'monospace' }}>
              ESC
            </kbd>{' '}
            Close
          </div>
        </div>
      </div>

      <style>{`
        .command-item:hover {
          background-color: ${colors.neutral[50]};
        }
      `}</style>
    </>
  );
}
