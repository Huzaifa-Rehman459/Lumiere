import { X, Minus, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartPage.css";

const CartPage = () => {
  const { cart, loading, notice, clearNotice, removeFromCart, updateQuantity } =
    useCart();
  const navigate = useNavigate();

  const handleDecrease = (item) => {
    if (item.quantity <= 1) return;
    updateQuantity(item._id, item.quantity - 1).catch((err) =>
      alert(err.message),
    );
  };

  const handleIncrease = (item) => {
    updateQuantity(item._id, item.quantity + 1).catch((err) =>
      alert(err.message),
    );
  };

  if (loading) {
    return (
      <div className="cart-page">
        <p className="cart-status">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Continue Shopping
      </button>

      <h1>Your Cart</h1>

      {notice && (
        <div className="cart-notice">
          <span>{notice}</span>
          <button onClick={clearNotice}>
            <X size={14} />
          </button>
        </div>
      )}

      {cart.items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>

                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <div>
                      <h3>{item.product.name}</h3>
                      <p className="cart-item-variant">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && "  "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() =>
                        removeFromCart(item._id).catch((err) =>
                          alert(err.message),
                        )
                      }
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {!item.inStock && (
                    <p className="cart-item-warning">
                      Only {item.stock} left in stock — please adjust the
                      quantity.
                    </p>
                  )}

                  <div className="cart-item-bottom">
                    <div className="quantity-control">
                      <button
                        onClick={() => handleDecrease(item)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleIncrease(item)}
                        disabled={
                          item.quantity >= 10 || item.quantity >= item.stock
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="cart-item-price">
                      PKR {item.lineTotal.toFixed(2)}
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
              <span>PKR {cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {cart.shipping === 0 ? "Free" : `PKR ${cart.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>PKR {cart.total.toFixed(2)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/Checkout")}
            >
              Proceed to Checkout →
            </button>
            <button
              className="continue-btn"
              onClick={() => navigate("/ShopAll")}
            >
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;