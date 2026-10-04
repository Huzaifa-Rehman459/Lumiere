import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import "./ProductCard.css";

function ProductCard({ id, image, name, price }) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();
  const liked = isWishlisted(id);

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate("/Login");
      return;
    }
    toggleWishlist(id).catch((err) => console.error("Wishlist error:", err.message));
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
          <p>PKR {price}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;