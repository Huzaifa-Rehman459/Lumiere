import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AdminProvider } from "./context/AdminContext";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <AdminProvider><App /></AdminProvider>
    </BrowserRouter>
);
