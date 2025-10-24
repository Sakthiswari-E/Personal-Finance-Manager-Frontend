// frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

//  Import context providers
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

//  Optional: React Router v7 compatibility flags (to silence warnings)
const routerFutureConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/*  Router must be outermost */}
    <BrowserRouter future={routerFutureConfig.future}>
      {/*  AuthProvider must wrap AppProvider 
          because AppContext needs Auth info & refreshData after login */}
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
