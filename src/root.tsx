import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { AuthProvider } from "./contexts/AuthContext";
import Main from "./Main";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <Main>
        <Router />
      </Main>
    </AuthProvider>
  </React.StrictMode>
);
