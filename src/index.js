import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { createTheme } from '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles';
import theme from './theme';

// TODO: CRIO_TASK_MODULE_REGISTER - Add Target container ID (refer public/index.html)

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          preventDuplicate
        >
          <App />
         
        </SnackbarProvider>
         </ThemeProvider>
  </React.StrictMode>,
   document.getElementById('root')
);
