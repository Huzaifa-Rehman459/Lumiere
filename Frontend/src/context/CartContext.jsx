import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../api/client";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext();

const EMPTY_CART = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  shipping: 0,
  total: 0,
};

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const { notify } = useToast();
  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const applyResponse = (data) => {
    setCart(data.cart);
    if (data.removedItems > 0) {
      setNotice(
        data.removedItems === 1
          ? "1 item was removed from your cart because it's no longer available."
          : `${data.removedItems} items were removed from your cart because they're no longer available.`,
      );
    }
  };

  const refreshCart = async () => {
    if (!isLoggedIn) {
      setCart(EMPTY_CART);
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest("/cart", { auth: true });
      applyResponse(data);
    } catch (err) {
      console.error("Could not load cart:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reload whenever login state changes (login, logout, token expiry)
  useEffect(() => {
    refreshCart();
  }, [isLoggedIn]);

  const addToCart = async (productId, { size, color, quantity = 1 } = {}) => {
    try {
      const data = await apiRequest("/cart/items", {
        method: "POST",
        auth: true,
        body: { productId, size, color, quantity },
      });
      applyResponse(data);
      notify("Added to cart");
      return data;
    } catch (err) {
      notify(err.message, "error");
      throw err;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const data = await apiRequest(`/cart/items/${itemId}`, {
        method: "PUT",
        auth: true,
        body: { quantity },
      });
      applyResponse(data);
      notify("Cart updated");
      return data;
    } catch (err) {
      notify(err.message, "error");
      throw err;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const data = await apiRequest(`/cart/items/${itemId}`, {
        method: "DELETE",
        auth: true,
      });
      applyResponse(data);
      notify("Removed from cart");
      return data;
    } catch (err) {
      notify(err.message, "error");
      throw err;
    }
  };

  const clearNotice = () => setNotice("");

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        notice,
        clearNotice,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}