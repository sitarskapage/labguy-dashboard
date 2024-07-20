import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline, GlobalStyles } from "@mui/material";
import { ReactNode, useContext } from "react";
import { GeneralContext } from "./contexts/GeneralContext";

const Theme = ({ children }: { children: ReactNode }) => {
  const { settings } = useContext(GeneralContext);

  const theme = createTheme({
    palette: {
      mode: settings?.general?.dashboard?.dark_mode ? "dark" : "light",

      primary: {
        main: "#37ffb0",
      },
      secondary: {
        main: "#808080",
      },
    },
  });

  const globalStyles = {
    html: {
      minHeight: "100vh",
      margin: 0,
      padding: 0,
    },
    body: {
      minHeight: "100vh",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    },
    "#root": {
      flexGrow: 1,
      minHeight: "100%",
    },
    ".tox.tox-tinymce *": {
      background: `${theme.palette.background.paper}!important`,
    },
    ".tox-tinymce": {
      border: "none",
    },
    "*": {
      boxSizing: "border-box",
    },
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
