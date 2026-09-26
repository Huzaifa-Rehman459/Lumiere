import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, Share2 } from "lucide-react";
import bestSeller from "../../assets/assets";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./ProductDetail.css";

const COLORS = [
  { name: "Pink", hex: "#e8a1a8" },
  { name: "Sky", hex: "#5f8fbf" },
  { name: "Charcoal", hex: "#3a3a3a" },
  { name: "Sand", hex: "#e7ddd0" },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

function StarRating({ value, count }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="pd-rating">
      <span className="pd-rating__stars" aria-hidden="true">
        {stars.map((s) => (
          <span key={s} className={s <= Math.round(value) ? "is-filled" : ""}>
            ★
          </span>
        ))}
      </span>
      <span className="pd-rating__value">
        {value} {count ? `(${count})` : ""}
      </span>
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="pd-accordion">
      <button
        className="pd-accordion__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={`pd-accordion__chevron ${open ? "is-open" : ""}`}>
          ⌄
        </span>
      </button>
      {open && <div className="pd-accordion__panel">{children}</div>}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const product = bestSeller.find((item) => item.id === Number(id));

  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  // If the id in the URL doesn't match anything, show a fallback instead
  // of crashing on product.name etc.
  if (!product) {
    return (
      <main className="pd-page">
        <div className="pd-not-found">
          <h1>Product not found</h1>
          <p>We couldn't find the item you're looking for.</p>
          <Link className="pd-add-to-cart pd-not-found__link" to="/ShopAll">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const liked = isWishlisted(product.id);
  const relatedProducts = bestSeller
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => Math.min(99, q + 1));

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        image: product.image,
        name: product.name,
        price: product.price,
        color: selectedColor,
        size: selectedSize,
      },
      quantity
    );
  };

  return (
    <main className="pd-page">
      <section className="pd-product">
        <div className="pd-gallery">
          <img
            className="pd-gallery__image"
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="pd-info">
          <h1 className="pd-info__title">{product.name}</h1>
          <StarRating value={product.rating ?? 4.5} count={product.reviewCount} />

          <p className="pd-info__price">
            ${product.price}
            {product.oldPrice && (
              <span className="pd-info__old-price">${product.oldPrice}</span>
            )}
          </p>

          <p className="pd-info__description">
            {product.description ??
              "A carefully made piece designed for everyday comfort and style."}
          </p>

          <div className="pd-option">
            <span className="pd-option__label">
              Color <em>{selectedColor}</em>
            </span>
            <div className="pd-swatches">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  className={`pd-swatch ${
                    selectedColor === color.name ? "is-selected" : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                  aria-pressed={selectedColor === color.name}
                  onClick={() => setSelectedColor(color.name)}
                />
              ))}
            </div>
          </div>

          <div className="pd-option">
            <span className="pd-option__label">Size</span>
            <div className="pd-sizes">
              {SIZES.map((size) => (
                <button
                  key={size}
                  className={`pd-size ${
                    selectedSize === size ? "is-selected" : ""
                  }`}
                  aria-pressed={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="pd-purchase-row">
            <div className="pd-qty">
              <button aria-label="Decrease quantity" onClick={decrement}>
                −
              </button>
              <span>{quantity}</span>
              <button aria-label="Increase quantity" onClick={increment}>
                +
              </button>
            </div>
            <button className="pd-add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

          <div className="pd-secondary-actions">
            <button
              className={`pd-link-btn ${liked ? "is-active" : ""}`}
              onClick={() => toggleWishlist(product)}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              {liked ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>
            <button className="pd-link-btn">
              <Share2 size={16} /> Share
            </button>
          </div>

          <div className="pd-accordions">
            <Accordion title="Product Details">
              {product.description ??
                "Made from quality materials designed to last, wash after wash."}
            </Accordion>
            <Accordion title="Size & Fit">
              True to size. For a looser fit, consider ordering one size up.
            </Accordion>
            <Accordion title="Shipping & Returns">
              Free standard shipping on orders over $50. Easy 30-day returns
              on unworn items with tags attached.
            </Accordion>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="pd-related">
          <h2 className="pd-related__heading">You may also like</h2>
          <div className="pd-related__grid">
            {relatedProducts.map((item) => (
              <button
                key={item.id}
                className="pd-related-card"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <div className="pd-related-card__image-wrap">
                  <img src={item.image} alt={item.name} />
                </div>
                <p className="pd-related-card__name">{item.name}</p>
                <p className="pd-related-card__price">${item.price}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
