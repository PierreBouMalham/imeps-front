import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.jsx";
import entities from "./entities";
import "./index.css";
import Datatable from "./views/Datatable.jsx";
import Home from "./views/Home.jsx";
import { AuthProvider } from "./contexts/Auth.context.jsx";
import { Toaster } from "react-hot-toast";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <AuthProvider>
            <Toaster
              toastOptions={{
                style: {
                  fontFamily: "Roboto",
                },
              }}
            />
            <App />
          </AuthProvider>
        }
      >
        <Route index element={<Home />} />

        {entities.map((entity) => {
          return (
            <Route
              key={"Entity: " + entity.url}
              path={entity.url}
              element={<Datatable entity={entity} />}
            />
          );
        })}
        <Route />
      </Route>
    </Routes>
  </BrowserRouter>
);
