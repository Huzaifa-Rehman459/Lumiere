// pages/CartPage.jsx
import { X, Minus, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Continue Shopping
      </button>

      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <h3>{item.name}</h3>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="cart-item-bottom">
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, -1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="cart-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <button className="checkout-btn">Proceed to Checkout →</button>
            <button className="continue-btn" onClick={() => navigate(-2)}>
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;