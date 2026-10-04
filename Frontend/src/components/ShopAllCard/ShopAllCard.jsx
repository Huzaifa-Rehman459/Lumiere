import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import fallbackImg from "../../assets/dress-img-1.jpg";
import "./ShopAllCard.css";

function ShopAllCard({ id, image, name, price }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const liked = isWishlisted(id);

  const goToProduct = () => navigate(`/product/${id}`);

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate("/Login");
      return;
    }
    toggleWishlist(id).catch((err) => console.error("Wishlist error:", err.message));
  };

  return (
    <div className="shopAll-card" onClick={goToProduct}>
      <div className="card-image">
        <img src={image || fallbackImg} alt={name} />
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
          <button className="cart-btn" onClick={(e) => { e.stopPropagation(); goToProduct(); }}>
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShopAllCard;