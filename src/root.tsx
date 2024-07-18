import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import Main from "./Main";
import { GeneralProvider } from "./contexts/GeneralContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GeneralProvider>
      <Main>
        <Router />
      </Main>
    </GeneralProvider>
  </React.StrictMode>
);
