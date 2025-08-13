import React, { useMemo, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import App from './App.jsx';
import { store } from './app/store.js';
import createAppTheme from './app/theme.js';
import { ColorModeContext } from './app/ColorModeContext.js';

import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/pathway-gothic-one/400.css';

function getInitialMode() {
  try {
    const saved = localStorage.getItem('color-mode');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  // Default: Dark mode
  return 'dark';
}

function Root() {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    try {
      localStorage.setItem('color-mode', mode);
    } catch {}
    document.documentElement.setAttribute('data-color-mode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <Provider store={store}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
