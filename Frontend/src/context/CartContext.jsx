// context/CartContext.jsx
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        )
    );
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}