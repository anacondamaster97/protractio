export const lightTheme = {
  colors: {
    primary: '#FF5722', // Vibrant orange
    secondary: '#FF9800', // Lighter orange
    accent: '#FFC107', // Amber for contrast
    background: {
      main: '#ffffff',
      secondary: '#f9fafb',
      card: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      muted: '#6b7280',
    },
    border: {
      light: '#e5e7eb',
      default: '#d1d5db',
    },
    status: {
      success: '#059669',
      error: '#dc2626',
      warning: '#d97706',
    }
  },
  gradients: {
    primary: ['#FF5722', '#FF9800'],
    secondary: ['#FFC107', '#FFE082'],
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  }
};

export type Theme = typeof lightTheme;

// Optional: Create a dark theme
export const darkTheme: Theme = {
  colors: {
    primary: '#FF5722',
    secondary: '#FF9800',
    accent: '#FFC107',
    background: {
      main: '#111827',
      secondary: '#1f2937',
      card: '#1f2937',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#e5e7eb',
      muted: '#9ca3af',
    },
    border: {
      light: '#374151',
      default: '#4b5563',
    },
    status: {
      success: '#059669',
      error: '#dc2626',
      warning: '#d97706',
    }
  },
  gradients: lightTheme.gradients,
  shadows: lightTheme.shadows,
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
}; 