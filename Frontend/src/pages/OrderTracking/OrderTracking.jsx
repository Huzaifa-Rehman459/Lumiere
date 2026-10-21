import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRequest } from "../../api/client";
import "./OrderTracking.css";

const STEPS = [
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(
    searchParams.get("order") || "",
  );
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

  useEffect(() => {
    if (searchParams.get("order")) handleTrack();
  }, []);

  const stepIndex = order ? STEPS.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="tracking-page">
      <div className="tracking-card">
        <h1>Track Your Order</h1>
        <p className="tracking-sub">
          Enter your order number to see where it's at.
        </p>

        <form onSubmit={handleTrack} className="tracking-form">
          <input
            placeholder="e.g. LM-8F3K2A1"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}

        {order && (
          <div className="tracking-result">
            <div className="tracking-result-head">
              <h2>Order {order.orderNumber}</h2>
              <span>
                Placed {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>

            {order.status === "cancelled" ? (
              <p className="tracking-cancelled">This order was cancelled.</p>
            ) : (
              <div className="tracking-progress">
                {STEPS.map((step, i) => (
                  <div className="tracking-progress-step" key={step.key}>
                    <div className="tracking-progress-track">
                      <span
                        className={`tracking-dot ${i <= stepIndex ? "is-done" : ""}`}
                      />
                      {i < STEPS.length - 1 && (
                        <span
                          className={`tracking-connector ${i < stepIndex ? "is-done" : ""}`}
                        />
                      )}
                    </div>
                    <span
                      className={`tracking-step-label ${i <= stepIndex ? "is-done" : ""}`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="tracking-items">
              {order.items.map((item, i) => (
                <div className="tracking-item" key={i}>
                  {item.image && <img src={item.image} alt="" />}
                  <div className="tracking-item-info">
                    <p>{item.name}</p>
                    <span>Qty {item.quantity}</span>
                  </div>
                  <b>${item.lineTotal.toFixed(2)}</b>
                </div>
              ))}
              <div className="tracking-item tracking-total">
                <span>Total</span>
                <b>${order.total.toFixed(2)}</b>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;