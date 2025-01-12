import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import AddProduct from "./components/AddProduct"; 
import { AuthProvider } from "./components/AuthContext"; 
import PrivateRoute from "./components/PrivateRoute"; // Proteção de Rota

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />, // Página de login
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Products />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "add-product",
        element: (
          <PrivateRoute>
            <AddProduct />
          </PrivateRoute>
        ), // Protegendo a rota de cadastro
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
