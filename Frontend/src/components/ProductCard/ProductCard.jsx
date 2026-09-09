// components/ProductCard.jsx
import { useState } from "react";
import { Heart } from "lucide-react";
import "./ProductCard.css"

function ProductCard({ image, name, price, oldPrice }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="product-card">
      <div className="card-image">
        <img src={image} alt={name} />
        <button
          className={`heart-btn ${liked ? "active" : ""}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="card-info">
        <h3>{name}</h3>
        <div className="prices">
            <p>${price}</p>
            <span>${oldPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;