import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import "./ShopAllCard.css"

function ShopAllCard({ id, image, name, price }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const liked = isWishlisted(id);

  const handleAddToCart = () => {
    addToCart({ id, image, name, price });
    navigate("/cart");
  };

  return (
    <div className="shopAll-card">
      <div className="card-image">
        <img src={image} alt={name} />
        <button
          className={`heart-btn ${liked ? "active" : ""}`}
          onClick={() => toggleWishlist({ id, image, name, price })}
        >
          <Heart fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="card-info">
        <h3>{name}</h3>
        <div className="prices">
          <p>${price}</p>
          <button className="cart-btn" onClick={handleAddToCart}>
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShopAllCard;