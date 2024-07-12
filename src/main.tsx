import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { AuthProvider } from "./contexts/AuthContext";
import { createTheme, ThemeProvider } from "@mui/material";
const theme = createTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <React.StrictMode>
        <Router />
      </React.StrictMode>
    </AuthProvider>
  </ThemeProvider>
);
