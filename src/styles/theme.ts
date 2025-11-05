export const theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    text: {
      primary: '#333',
      secondary: '#666',
      light: '#999',
    },
    background: {
      white: '#fff',
      light: '#f5f5f5',
      lighter: '#f0f0f0',
    },
    border: {
      light: '#ddd',
      dark: '#000',
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.2rem',
      xl: '1.5rem',
      '2xl': '2rem',
    },
  },
} as const
