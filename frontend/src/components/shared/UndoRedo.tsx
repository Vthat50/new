import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Undo, Redo } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface UndoRedoState<T = any> {
  past: T[];
  present: T;
  future: T[];
}

interface UndoRedoContextValue {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  setState: (newState: any) => void;
  clearHistory: () => void;
}

const UndoRedoContext = createContext<UndoRedoContextValue | null>(null);

interface UndoRedoProviderProps<T> {
  children: ReactNode;
  initialState: T;
  maxHistorySize?: number;
  onChange?: (state: T) => void;
}

export function UndoRedoProvider<T>({
  children,
  initialState,
  maxHistorySize = 50,
  onChange,
}: UndoRedoProviderProps<T>) {
  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);

    setState({
      past: newPast,
      present: previous,
      future: [state.present, ...state.future],
    });

    if (onChange) {
      onChange(previous);
    }
  }, [state, canUndo, onChange]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const next = state.future[0];
    const newFuture = state.future.slice(1);

    setState({
      past: [...state.past, state.present],
      present: next,
      future: newFuture,
    });

    if (onChange) {
      onChange(next);
    }
  }, [state, canRedo, onChange]);

  const setStateWithHistory = useCallback(
    (newState: T) => {
      // Don't add to history if state is the same
      if (JSON.stringify(newState) === JSON.stringify(state.present)) {
        return;
      }

      const newPast = [...state.past, state.present];

      // Limit history size
      if (newPast.length > maxHistorySize) {
        newPast.shift();
      }

      setState({
        past: newPast,
        present: newState,
        future: [], // Clear future when new action is taken
      });

      if (onChange) {
        onChange(newState);
      }
    },
    [state, maxHistorySize, onChange]
  );

  const clearHistory = useCallback(() => {
    setState({
      past: [],
      present: state.present,
      future: [],
    });
  }, [state.present]);

  return (
    <UndoRedoContext.Provider
      value={{
        canUndo,
        canRedo,
        undo,
        redo,
        setState: setStateWithHistory,
        clearHistory,
      }}
    >
      {children}
    </UndoRedoContext.Provider>
  );
}

export function useUndoRedo() {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error('useUndoRedo must be used within UndoRedoProvider');
  }
  return context;
}

// Keyboard shortcut hook for undo/redo
export function useUndoRedoShortcuts() {
  const { undo, redo } = useUndoRedo();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + Z: Undo
      if (modifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Cmd/Ctrl + Shift + Z: Redo
      if (modifier && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      }

      // Cmd/Ctrl + Y: Alternative Redo (Windows style)
      if (modifier && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);
}

// UI Controls Component
interface UndoRedoControlsProps {
  showLabels?: boolean;
  variant?: 'buttons' | 'toolbar';
}

export function UndoRedoControls({ showLabels = true, variant = 'buttons' }: UndoRedoControlsProps) {
  const { canUndo, canRedo, undo, redo } = useUndoRedo();
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const mod = isMac ? '⌘' : 'Ctrl';

  if (variant === 'toolbar') {
    return (
      <div
        style={{
          display: 'flex',
          gap: spacing[1],
          padding: spacing[1],
          backgroundColor: colors.neutral[100],
          borderRadius: '6px',
        }}
      >
        <button
          onClick={undo}
          disabled={!canUndo}
          title={`Undo (${mod}+Z)`}
          style={{
            padding: spacing[2],
            backgroundColor: canUndo ? 'white' : 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: canUndo ? 'pointer' : 'not-allowed',
            color: canUndo ? colors.neutral[700] : colors.neutral[400],
            display: 'flex',
            alignItems: 'center',
            gap: spacing[1],
          }}
        >
          <Undo style={{ width: '16px', height: '16px' }} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title={`Redo (${mod}+Shift+Z)`}
          style={{
            padding: spacing[2],
            backgroundColor: canRedo ? 'white' : 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: canRedo ? 'pointer' : 'not-allowed',
            color: canRedo ? colors.neutral[700] : colors.neutral[400],
            display: 'flex',
            alignItems: 'center',
            gap: spacing[1],
          }}
        >
          <Redo style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: spacing[2] }}>
      <button
        onClick={undo}
        disabled={!canUndo}
        style={{
          padding: `${spacing[2]} ${spacing[3]}`,
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[300]}`,
          borderRadius: '6px',
          fontSize: typography.fontSize.sm,
          cursor: canUndo ? 'pointer' : 'not-allowed',
          color: canUndo ? colors.neutral[700] : colors.neutral[400],
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          opacity: canUndo ? 1 : 0.5,
        }}
        title={`${mod}+Z`}
      >
        <Undo style={{ width: '16px', height: '16px' }} />
        {showLabels && <span>Undo</span>}
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        style={{
          padding: `${spacing[2]} ${spacing[3]}`,
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[300]}`,
          borderRadius: '6px',
          fontSize: typography.fontSize.sm,
          cursor: canRedo ? 'pointer' : 'not-allowed',
          color: canRedo ? colors.neutral[700] : colors.neutral[400],
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          opacity: canRedo ? 1 : 0.5,
        }}
        title={`${mod}+Shift+Z`}
      >
        <Redo style={{ width: '16px', height: '16px' }} />
        {showLabels && <span>Redo</span>}
      </button>
    </div>
  );
}

// Toast notification for undo/redo actions
interface UndoToastProps {
  message: string;
  onUndo: () => void;
  duration?: number;
}

export function UndoToast({ message, onUndo, duration = 5000 }: UndoToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: spacing[6],
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: colors.neutral[900],
        color: 'white',
        padding: spacing[4],
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: spacing[4],
        zIndex: 10000,
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <span style={{ fontSize: typography.fontSize.sm }}>{message}</span>
      <button
        onClick={() => {
          onUndo();
          setIsVisible(false);
        }}
        style={{
          padding: `${spacing[1]} ${spacing[3]}`,
          backgroundColor: colors.primary[500],
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          cursor: 'pointer',
        }}
      >
        Undo
      </button>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
