import { X } from "lucide-react";
import StatusBadge from "../StatusBadge/StatusBadge";
import { money } from "../../utils/adminHelpers";
import "../EntityModal/EntityModal.css";
import "./OrderModal.css";

const label = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function OrderModal({ order, onClose }) {
  const a = order.shippingAddress;

  return (
    <div className="entity-backdrop" onClick={onClose}>
      <div className="entity-modal order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="entity-modal-head">
          <h2>Order {order.orderNumber}</h2>
          <button type="button" className="bare-icon" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="order-meta">
          <StatusBadge status={label(order.status)} />
          <span>Placed {new Date(order.createdAt).toLocaleString()}</span>
        </div>

        <div className="order-cols">
          <section>
            <h3>Ship to</h3>
            <p>
              <b>{a.fullName}</b>
              <br />
              {a.addressLine}
              <br />
              {a.city} {a.postalCode}
              <br />
              {a.phone}
            </p>
          </section>
          <section>
            <h3>Customer account</h3>
            <p>
              {order.user?.fullName ?? "—"}
              <br />
              {order.user?.email ?? ""}
            </p>
          </section>
        </div>

        <h3>Items</h3>
        <div className="order-items">
          {order.items.map((item, i) => (
            <div className="order-item" key={i}>
              {item.image ? (
                <img src={item.image} alt="" />
              ) : (
                <span className="order-item-noimg" />
              )}
              <div className="order-item-info">
                <b>{item.name}</b>
                <small>
                  {[item.size && `Size ${item.size}`, item.color]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </small>
              </div>
              <span>
                {item.quantity} × {money(item.price)}
              </span>
              <b>{money(item.lineTotal)}</b>
            </div>
          ))}
        </div>

        <div className="order-totals">
          <div>
            <span>Subtotal</span>
            <span>{money(order.subtotal)}</span>
          </div>
          <div>
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : money(order.shipping)}</span>
          </div>
          <div className="order-totals-final">
            <span>Total</span>
            <span>{money(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}