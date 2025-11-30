import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { AuthProvider } from "./context/authContext.jsx";
import { CartProvider } from "./context/cartContext.jsx";

import "./index.css";
import "./output.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
