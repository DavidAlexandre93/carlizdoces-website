import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const queryClient = new QueryClient();

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: '#b13d5b', dark: '#7f233d', light: '#d8778b' },
    secondary: { main: '#216d68', dark: '#164b48', light: '#62a39b' },
    background: { default: '#fbf7f1', paper: '#fffdf9' },
    text: { primary: '#2f2525', secondary: '#685b59' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ['Avenir Next', 'Trebuchet MS', 'sans-serif'].join(','),
    h1: { fontFamily: ['Bodoni 72', 'Didot', 'Baskerville', 'serif'].join(','), fontWeight: 700 },
    h2: { fontFamily: ['Bodoni 72', 'Didot', 'Baskerville', 'serif'].join(','), fontWeight: 700 },
    h3: { fontFamily: ['Bodoni 72', 'Didot', 'Baskerville', 'serif'].join(','), fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, minHeight: 44 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        ':focus-visible': {
          outline: '3px solid #d69237',
          outlineOffset: 3,
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            scrollBehavior: 'auto !important',
            transitionDuration: '0.01ms !important',
          },
        },
      },
    },
  },
});

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
