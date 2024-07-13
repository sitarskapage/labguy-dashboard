import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";

import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { AuthProvider } from "./contexts/AuthContext";
import {
  createTheme,
  GlobalStyles,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";

const Main = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",

      primary: {
        main: "#a6fadb",
      },
      secondary: {
        main: "#dedede",
      },
    },
  });
  const backgroundColor = theme.palette.background.paper;

  const styles = `
    /* Add global styles here */
      html {
        min-height: 100vh;
        margin: 0;
        padding: 0;
      }
      body {
        min-height: 100vh;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      #root {
        flex-grow: 1;
        min-height: 100%;       
      }
        .tox.tox-tinymce * {background: ${backgroundColor}!important;}
        
        .tox-tinymce{border: none;} 

  .form-group {
  padding: 32px;
  }
  `;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <GlobalStyles styles={styles} />
      {children}
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <React.StrictMode>
      <Main>
        <Router />
      </Main>
    </React.StrictMode>
  </AuthProvider>
);
