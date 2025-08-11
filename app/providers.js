'use client';

import { ThemeProvider, createTheme, CssBaseline, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

export default function Providers({ children }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => createTheme({
    palette: {
      mode: prefersDark ? 'dark' : 'light',
      ...(prefersDark
        ? {
            background: { default: '#0b0e12', paper: '#12161b' },
            primary: { main: '#60a5fa' },
            secondary: { main: '#7dd3fc' },
            divider: '#1f2937',
          }
        : {
            background: { default: '#ffffff', paper: '#f7f7f8' },
            primary: { main: '#2563eb' },
            secondary: { main: '#64748b' },
            divider: '#e5e7eb',
          }),
    },
    typography: { fontSize: 14 },
    shape: { borderRadius: 12 },
  }), [prefersDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
