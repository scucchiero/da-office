import React from "react";
import ReactDOM from "react-dom";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { DialogProvider } from "components/DialogProvider";
import theme from "theme";
import {
  ToastsContainer,
  ToastsStore
} from "react-toasts";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DialogProvider>
        <App />
        <ToastsContainer
          position="bottom_center"
          store={ToastsStore}
        />
      </DialogProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
