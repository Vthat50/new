/**
 * Enterprise Design System
 * Based on Vevara's neutral, professional design
 */

// ============================================================
// COLOR PALETTE - Neutral & Minimal
// ============================================================

export const colors = {
  // Neutrals (primary palette - use 90% of the time)
  neutral: {
    50: '#FAFAFA',   // Background subtle
    100: '#F5F5F5',  // Background hover
    200: '#E5E5E5',  // Border light
    300: '#D4D4D4',  // Border default
    400: '#A3A3A3',  // Text muted
    500: '#737373',  // Text secondary
    600: '#525252',  // Text primary
    700: '#404040',  // Text emphasis
    800: '#262626',  // Text strong
    900: '#171717',  // Text heading
  },

  // Primary (use sparingly - only for key actions)
  primary: {
    25: '#F0F9FF',
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',  // Primary action blue
    600: '#2563EB',  // Primary action blue hover
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Secondary colors
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Accent colors
  accent: {
    50: '#FDF4FF',
    100: '#FAE8FF',
    200: '#F5D0FE',
    300: '#F0ABFC',
    400: '#E879F9',
    500: '#D946EF',
    600: '#C026D3',
    700: '#A21CAF',
    800: '#86198F',
    900: '#701A75',
  },

  // Amber (referenced in some components)
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Status colors (minimal, clear)
  status: {
    success: '#10B981',      // Green
    successBg: '#ECFDF5',
    warning: '#F59E0B',      // Amber
    warningBg: '#FFFBEB',
    error: '#EF4444',        // Red
    errorBg: '#FEF2F2',
    info: '#3B82F6',         // Blue
    infoBg: '#EFF6FF',
  },

  // Background
  background: {
    page: '#FAFAFA',         // Main page background
    card: '#FFFFFF',         // Card/panel background
    elevated: '#FFFFFF',     // Modal/dropdown background
  },
};

// ============================================================
// SPACING - 8px Grid System
// ============================================================

export const spacing = {
  0: '0px',
  1: '4px',    // 0.5 * 8px
  2: '8px',    // 1 * 8px
  3: '12px',   // 1.5 * 8px (exception for compact layouts)
  4: '16px',   // 2 * 8px
  6: '24px',   // 3 * 8px
  8: '32px',   // 4 * 8px
  10: '40px',  // 5 * 8px
  12: '48px',  // 6 * 8px
  16: '64px',  // 8 * 8px
  20: '80px',  // 10 * 8px
  24: '96px',  // 12 * 8px
};

// ============================================================
// TYPOGRAPHY - Consistent Hierarchy
// ============================================================

export const typography = {
  // Font families
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
  },

  // Font sizes (consistent scale)
  fontSize: {
    xs: '11px',     // Captions, labels
    sm: '13px',     // Secondary text
    base: '14px',   // Body text (default)
    md: '15px',     // Body emphasis
    lg: '16px',     // Subheadings
    xl: '18px',     // Small headings
    '2xl': '20px',  // Card headings
    '3xl': '24px',  // Page headings
    '4xl': '28px',  // Main headings
    '5xl': '32px',  // Hero headings
  },

  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

// ============================================================
// BORDERS & SHADOWS - Minimal & Clean
// ============================================================

export const borders = {
  radius: {
    none: '0px',
    sm: '4px',      // Buttons, inputs
    md: '6px',      // Cards (use sparingly)
    lg: '8px',      // Modals
    full: '9999px', // Pills, avatars
  },

  width: {
    thin: '1px',    // Standard border (use 95% of time)
    medium: '2px',  // Focus states, emphasized borders
    thick: '3px',   // Rare - only for status indicators
  },
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',           // Subtle lift
  md: '0 2px 4px -1px rgba(0, 0, 0, 0.06)',        // Standard elevation
  lg: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',        // Modal/dropdown
  xl: '0 10px 15px -3px rgba(0, 0, 0, 0.10)',      // High elevation (rare)
};

// ============================================================
// LAYOUT - Grid & Spacing
// ============================================================

export const layout = {
  containerMaxWidth: '1440px',
  sidebarWidth: '240px',
  headerHeight: '56px',

  // Page padding (consistent across all pages)
  pagePadding: {
    x: spacing[6],  // 24px horizontal
    y: spacing[6],  // 24px vertical
  },

  // Gap between cards/sections
  sectionGap: spacing[6],  // 24px

  // Gap within cards
  cardGap: spacing[4],     // 16px
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get status color based on value
 */
export function getStatusColor(status: 'success' | 'warning' | 'error' | 'info' | 'neutral') {
  const colorMap = {
    success: colors.status.success,
    warning: colors.status.warning,
    error: colors.status.error,
    info: colors.status.info,
    neutral: colors.neutral[500],
  };
  return colorMap[status];
}

/**
 * Get consistent text color classes
 */
export const textColors = {
  heading: 'text-neutral-900',
  body: 'text-neutral-700',
  secondary: 'text-neutral-500',
  muted: 'text-neutral-400',
};
