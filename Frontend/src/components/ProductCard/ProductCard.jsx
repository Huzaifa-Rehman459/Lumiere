// components/ProductCard.jsx
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import "./ProductCard.css"

function ProductCard({ id, image, name, price, oldPrice }) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const liked = isWishlisted(id);

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist({ id, image, name, price });
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${id}`)}>
      <div className="card-image">
        <img src={image} alt={name} />
        <button
          className={`heart-btn ${liked ? "active" : ""}`}
          onClick={handleToggleWishlist}
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