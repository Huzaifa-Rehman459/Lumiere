import { useWishlist } from "../../context/WishlistContext";
import ShopAllCard from "../ShopAllCard/ShopAllCard";
import "./WishlistPage.css";

const WishlistPage = () => {
  const { products, loading } = useWishlist();

  if (loading) {
    return (
      <div className="wishlist-page">
        <p className="wishlist-status">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>Wishlist</h1>
        <p>Your saved items</p>
      </div>

      {products.length === 0 ? (
        <div className="wishlist-empty">
          <p>You haven't saved anything yet.</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {products.map((item) => (
            <ShopAllCard
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;