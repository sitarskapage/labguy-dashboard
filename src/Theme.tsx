import {
  createTheme,
  CssBaseline,
  GlobalStyles,
  ThemeProvider
} from '@mui/material';
import { ReactNode } from 'react';
import useDarkMode from './hooks/useDarkMode';

const Theme = ({ children }: { children: ReactNode }) => {
  const theme = createTheme({
    palette: {
      mode: useDarkMode() ? 'dark' : 'light',
      primary: {
        main: '#37ffb0'
      },
      secondary: {
        main: '#808080'
      }
    }
  });

  const globalStyles = {
    html: {
      minHeight: '100vh',
      margin: 0,
      padding: 0
    },
    body: {
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    },
    '#root': {
      flexGrow: 1,
      minHeight: '100%'
    },
    '.tox.tox-tinymce *': {
      background: `${theme.palette.background.paper}!important`
    },
    '.tox-tinymce': {
      border: 'none'
    },
    '*': {
      boxSizing: 'border-box'
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <GlobalStyles styles={globalStyles} />
      {children}
    </ThemeProvider>
  );
};
export default Theme;
