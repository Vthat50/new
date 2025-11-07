import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onSearch?: () => void;
  onNewItem?: () => void;
  onCommandPalette?: () => void;
  onNavigateTab?: (tabIndex: number) => void;
  onHelp?: () => void;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + K: Global Search
      if (modifier && e.key === 'k') {
        e.preventDefault();
        config.onSearch?.();
      }

      // Cmd/Ctrl + /: Show shortcuts help
      if (modifier && e.key === '/') {
        e.preventDefault();
        config.onHelp?.();
      }

      // Cmd/Ctrl + N: New item
      if (modifier && e.key === 'n') {
        e.preventDefault();
        config.onNewItem?.();
      }

      // Cmd/Ctrl + P: Command palette
      if (modifier && e.key === 'p') {
        e.preventDefault();
        config.onCommandPalette?.();
      }

      // Cmd/Ctrl + S: Save
      if (modifier && e.key === 's') {
        e.preventDefault();
        config.onSave?.();
      }

      // Cmd/Ctrl + Z: Undo
      if (modifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        config.onUndo?.();
      }

      // Cmd/Ctrl + Shift + Z: Redo
      if (modifier && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        config.onRedo?.();
      }

      // Alt + Number: Navigate tabs
      if (e.altKey && ['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        config.onNavigateTab?.(tabIndex);
      }

      // Escape: General close/cancel
      if (e.key === 'Escape') {
        // Let components handle this individually
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config]);
}

// Helper to display keyboard shortcuts
export const getKeyboardShortcuts = () => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const mod = isMac ? '⌘' : 'Ctrl';

  return [
    { keys: `${mod} K`, description: 'Open global search' },
    { keys: `${mod} /`, description: 'Show keyboard shortcuts' },
    { keys: `${mod} N`, description: 'Create new item' },
    { keys: `${mod} P`, description: 'Open command palette' },
    { keys: `${mod} S`, description: 'Save current work' },
    { keys: `${mod} Z`, description: 'Undo' },
    { keys: `${mod} Shift Z`, description: 'Redo' },
    { keys: 'Alt 1-6', description: 'Navigate to tab' },
    { keys: 'Esc', description: 'Close modal/cancel' },
  ];
};
