import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Link as MLink,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PeoplePage from './features/people/PeoplePage.jsx';
import { ColorModeContext } from './app/ColorModeContext.js';
import { useContext } from 'react';
import Starfield from './components/Starfield.jsx';
import GlobalProgress from './components/GlobalProgress.jsx';
import './App.css';

export default function App() {
  const theme = useTheme();
  const { mode, toggleColorMode } = useContext(ColorModeContext);

  const { apiBaseUrl, usingFallback } = useSelector((s) => s.system || {});

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" position="relative">
      {theme.palette.mode === 'dark' ? <Starfield maxStars={220} /> : null}

      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Pathway Gothic One", Inter, sans-serif',
              letterSpacing: 8,
              color: (t) => (t.palette.mode === 'dark' ? 'primary.main' : 'text.primary'),
            }}
          >
            STAR WARS • DATA BANK
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip
            title={
              mode === 'dark' ? 'Switch to the Light Side' : 'Switch to the Dark Side'
            }
          >
            <IconButton
              onClick={toggleColorMode}
              color="inherit"
              sx={{ mr: 1 }}
              aria-label="Toggle color mode"
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <MLink
            href="https://swapi.dev/"
            target="_blank"
            rel="noreferrer"
            underline="hover"
            sx={{ mr: 1, color: 'text.secondary' }}
          >
            swapi.dev
          </MLink>

          {apiBaseUrl ? (
            <Chip
              size="small"
              label={new URL(apiBaseUrl).host + (usingFallback ? ' (fallback)' : '')}
              color={usingFallback ? 'secondary' : 'default'}
              variant={usingFallback ? 'filled' : 'outlined'}
            />
          ) : null}
        </Toolbar>

        {/* global indicator) */}
        <GlobalProgress />
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3, flex: 1, width: '100%' }}>
        <PeoplePage />
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 3, textAlign: 'center', position: 'relative' }}>
        <Typography
          variant="caption"
          sx={{
            color: (t) =>
              t.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.82)'
                : t.palette.text.secondary,
            textShadow: (t) =>
              t.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.6)' : 'none',
          }}
        >
          Built with React, Redux Toolkit, RTK Query & MUI. • by Aj.
        </Typography>
      </Box>
    </Box>
  );
}
