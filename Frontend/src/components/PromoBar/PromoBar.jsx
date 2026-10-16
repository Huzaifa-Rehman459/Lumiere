import { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./PromoBar.css";

const MESSAGES = [
  "Free delivery on orders above Rs. 3,000",
  "New Arrivals are now live — shop the latest styles",
];

const ROTATE_EVERY_MS = 4000;

const PromoBar = () => {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed || MESSAGES.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, ROTATE_EVERY_MS);
    return () => clearInterval(timer);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="promo-bar">
      <span className="promo-bar-text" key={index}>
        {MESSAGES[index]}
      </span>
      <button
        className="promo-bar-close"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default PromoBar;