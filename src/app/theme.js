import { createTheme, alpha } from '@mui/material/styles';

// MUI theme dark/light modes
const SW_YELLOW = '#FFE81F';
const SW_CYAN = '#00E5FF';

export default function createAppTheme(mode = 'dark') {
  const isDark = mode === 'dark';

  const BG = isDark ? '#0B0D13' : '#F4F6F8';
  const PAPER = isDark ? 'rgba(14,17,26,0.78)' : '#FFFFFF';
  const BORDER = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)';
  const DIVIDER = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
  const HEAD_TOP = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
  const HEAD_BOT = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)';
  const TRACK = isDark ? alpha(SW_YELLOW, 0.15) : 'rgba(0,0,0,0.06)';

  return createTheme({
    palette: {
      mode,
      primary: { main: SW_YELLOW, contrastText: '#111' },
      secondary: { main: SW_CYAN },
      background: { default: BG, paper: PAPER },
      divider: DIVIDER,
      ...(isDark ? {} : { text: { primary: '#1B1F28', secondary: '#5A6573' } }),
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: `"InterVariable", Inter, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`,
      h1: { fontFamily: `"Pathway Gothic One", Inter, sans-serif`, letterSpacing: 1.5 },
      h2: { fontFamily: `"Pathway Gothic One", Inter, sans-serif`, letterSpacing: 1.2 },
      h5: { fontFamily: `"Pathway Gothic One", Inter, sans-serif`, letterSpacing: 1.1 },
      button: { letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700 },
      overline: { letterSpacing: 1.2 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '::selection': { backgroundColor: alpha(SW_YELLOW, isDark ? 0.25 : 0.18) },
          body: { backgroundColor: BG },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: PAPER,
            backdropFilter: isDark ? 'saturate(120%) blur(6px)' : 'none',
            border: `1px solid ${BORDER}`,
            boxShadow: isDark
              ? `0 10px 30px ${alpha('#000', 0.45)}`
              : `0 6px 18px ${alpha('#000', 0.06)}`,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: { background: `linear-gradient(180deg, ${HEAD_TOP}, ${HEAD_BOT})` },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            borderBottom: `1px solid ${DIVIDER}`,
          },
          body: {
            borderBottom: `1px solid ${
              isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
            }`,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            border: `1px solid ${isDark ? alpha(SW_CYAN, 0.25) : 'rgba(0,0,0,0.08)'}`,
            boxShadow: isDark
              ? `0 0 0 1px ${alpha('#fff', 0.04)}, 0 20px 60px ${alpha('#000', 0.7)}`
              : `0 20px 60px ${alpha('#000', 0.14)}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 999, fontWeight: 700 },
          outlined: {
            borderColor: isDark ? 'rgba(255,255,255,0.24)' : 'rgba(0,0,0,0.20)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          containedPrimary: ({ theme }) => ({
            color: '#111',
            background: `linear-gradient(180deg, ${SW_YELLOW}, ${alpha(
              SW_YELLOW,
              theme.palette.mode === 'dark' ? 0.9 : 0.92
            )})`,
            // ↓ softer glow
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 0 8px ${alpha(SW_YELLOW, 0.28)}`
                : `0 3px 8px ${alpha('#000', 0.08)}`,
            '&:hover': {
              background: SW_YELLOW,
              // ↓ softer hover glow
              boxShadow:
                theme.palette.mode === 'dark'
                  ? `0 0 12px ${alpha(SW_YELLOW, 0.35)}`
                  : `0 4px 10px ${alpha('#000', 0.1)}`,
            },
            '&.Mui-disabled': {
              color: theme.palette.text.disabled,
              backgroundColor: theme.palette.action.disabledBackground,
              boxShadow: 'none',
              backgroundImage: 'none',
            },
          }),
          outlined: {
            borderColor: alpha(SW_CYAN, isDark ? 0.5 : 0.45),
            '&:hover': {
              borderColor: SW_CYAN,
              // ↓ softer outlined hover
              boxShadow: isDark
                ? `0 0 8px ${alpha(SW_CYAN, 0.18)}`
                : `0 2px 8px ${alpha('#000', 0.08)}`,
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          bar: { backgroundColor: SW_YELLOW },
          colorPrimary: { backgroundColor: TRACK },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: {
            '& fieldset': {
              borderColor: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.16)',
            },
            '&:hover fieldset': { borderColor: alpha(SW_CYAN, isDark ? 0.7 : 0.5) },
            '&.Mui-focused fieldset': {
              borderColor: isDark ? SW_CYAN : '#1976d2',
              boxShadow: isDark
                ? `0 0 0 1px ${alpha(SW_CYAN, 0.2)}`
                : `0 0 0 2px ${alpha('#1976d2', 0.12)}`,
            },
          },
        },
      },
    },
  });
}
