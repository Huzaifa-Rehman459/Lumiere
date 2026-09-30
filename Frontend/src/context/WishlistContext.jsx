import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../api/client";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const { notify } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = async () => {
    if (!isLoggedIn) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest("/wishlist", { auth: true });
      setProducts(data.products);
    } catch (err) {
      console.error("Could not load wishlist:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reload whenever login state changes (login, logout, token expiry)
  useEffect(() => {
    refreshWishlist();
  }, [isLoggedIn]);

  const toggleWishlist = async (productId) => {
    try {
      const data = await apiRequest("/wishlist/toggle", {
        method: "POST",
        auth: true,
        body: { productId },
      });
      setProducts(data.products);
      notify(data.saved ? "Added to wishlist" : "Removed from wishlist");
      return data.saved;
    } catch (err) {
      notify(err.message, "error");
      throw err;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const data = await apiRequest(`/wishlist/${productId}`, {
        method: "DELETE",
        auth: true,
      });
      setProducts(data.products);
      notify("Removed from wishlist");
    } catch (err) {
      notify(err.message, "error");
      throw err;
    }
  };

  const isWishlisted = (id) => products.some((p) => p._id === id);

  return (
    <WishlistContext.Provider
      value={{
        products,
        loading,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}