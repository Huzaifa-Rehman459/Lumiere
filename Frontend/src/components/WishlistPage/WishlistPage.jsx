import { useWishlist } from "../../context/WishlistContext";
import ShopAllCard from "../ShopAllCard/ShopAllCard";
import "./WishlistPage.css";

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>Wishlist</h1>
        <p>Your saved items</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <p>You haven't saved anything yet.</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <ShopAllCard
              key={item.id}
              id={item.id}
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