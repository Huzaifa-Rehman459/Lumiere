import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { apiRequest } from "../../api/client";
import "./Checkout.css";

const Checkout = () => {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const data = await apiRequest("/orders", { method: "POST", auth: true, body: form });
      await refreshCart(); // cart is now empty server-side
      navigate(`/OrderTracking?order=${data.order.orderNumber}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <p>Your cart is empty. Add something before checking out.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2>Shipping Address</h2>
          <div className="input-box">
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="input-box">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="input-box">
            <label>Address</label>
            <input name="addressLine" value={form.addressLine} onChange={handleChange} required />
          </div>
          <div className="input-box">
            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} required />
          </div>
          <div className="input-box">
            <label>Postal Code</label>
            <input name="postalCode" value={form.postalCode} onChange={handleChange} required />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={placing}>
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cart.items.map((item) => (
            <div className="checkout-line" key={item._id}>
              <span>{item.product.name} × {item.quantity}</span>
              <span>PKR {item.lineTotal.toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout-line">
            <span>Shipping</span>
            <span>{cart.shipping === 0 ? "Free" : `PKR ${cart.shipping.toFixed(2)}`}</span>
          </div>
          <div className="checkout-line checkout-total">
            <span>Total</span>
            <span>PKR {cart.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;