import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

const queryClient = new QueryClient()

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: '#a51c5d', dark: '#751040', light: '#d75b92' },
    secondary: { main: '#5b2a86', dark: '#3d185e', light: '#8a5caf' },
    background: { default: '#fffafc', paper: '#ffffff' },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: ['Inter', 'Avenir Next', 'Segoe UI', 'sans-serif'].join(','),
    h1: { fontWeight: 850, letterSpacing: '-0.035em' },
    h2: { fontWeight: 820, letterSpacing: '-0.03em' },
    h3: { fontWeight: 800, letterSpacing: '-0.025em' },
    button: { fontWeight: 750, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, minHeight: 44 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
})

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
