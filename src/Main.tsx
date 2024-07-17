import { ThemeProvider } from "@emotion/react";
import {
  useMediaQuery,
  createTheme,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import { ReactNode } from "react";
interface MainProps {
  children: ReactNode;
}

const Main = ({ children }: MainProps) => {
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
        padding-left: 2rem;
        padding-right:2rem;
        }
  * {
        box-sizing: border-box;}
    `;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <GlobalStyles styles={styles} />
      {children}
    </ThemeProvider>
  );
};
export default Main;
