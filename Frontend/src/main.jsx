import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import Toast from "./components/Toast/Toast.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
            <Toast />
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>,
);