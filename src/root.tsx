import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { AuthProvider } from "./contexts/AuthContext";
import Main from "./Main";
import { SettingsProvider } from "./contexts/SettingsContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <React.StrictMode>
      <SettingsProvider>
        <Main>
          <Router />
        </Main>
      </SettingsProvider>
    </React.StrictMode>
  </AuthProvider>
);
