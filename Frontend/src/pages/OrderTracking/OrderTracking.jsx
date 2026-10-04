import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Truck } from "lucide-react";
import { apiRequest } from "../../api/client";
import "./OrderTracking.css";

const STEPS = ["processing", "shipped", "delivered"];

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const data = await apiRequest(`/orders/track/${orderNumber.trim()}`);
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-track if we arrived with ?order=... in the URL (from Checkout)
  useEffect(() => {
    if (searchParams.get("order")) handleTrack();
  }, []);

  const stepIndex = order ? STEPS.indexOf(order.status) : -1;

  return (
    <div className="tracking-page">
      <div className="tracking-left">
        <h1>Order Tracking</h1>
        <p>Enter your order number to track your package.</p>
        <form onSubmit={handleTrack} className="tracking-form">
          <input
            placeholder="e.g. LM-8F3K2A1"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}

        {order && (
          <div className="tracking-result">
            <h2>Order {order.orderNumber}</h2>
            <p className="tracking-date">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>

            {order.status === "cancelled" ? (
              <p className="tracking-cancelled">This order was cancelled.</p>
            ) : (
              <div className="tracking-steps">
                {STEPS.map((step, i) => (
                  <div
                    key={step}
                    className={`tracking-step ${i <= stepIndex ? "is-done" : ""}`}
                  >
                    <span className="tracking-dot" />
                    <span className="tracking-label">
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="tracking-items">
              {order.items.map((item, i) => (
                <div className="tracking-item" key={i}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>PKR {item.lineTotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="tracking-item tracking-total">
                <span>Total</span>
                <span>PKR {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="tracking-right">
        <Truck size={160} strokeWidth={1} />
      </div>
    </div>
  );
};

export default OrderTracking;