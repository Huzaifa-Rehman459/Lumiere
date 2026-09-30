import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, Share2 } from "lucide-react";
import { apiRequest } from "../../api/client";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import fallbackImg from "../../assets/dress-img-1.jpg";
import { useAuth } from "../../context/AuthContext";
import "./ProductDetail.css";

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
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [cartError, setCartError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistError, setWishlistError] = useState("");

  const [related, setRelated] = useState([]);

  // Fetch the product whenever the id in the URL changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setError("");
    setActiveImage(0);

    apiRequest(`/products/${id}`)
      .then((data) => {
        if (cancelled) return;
        setProduct(data.product);
        setSelectedColor(data.product.colors[0]?.name ?? null);
        setSelectedSize(data.product.sizes[0] ?? null);
        setQuantity(1);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 404 || err.status === 400) {
          setNotFound(true);
        } else {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Once we know the product's category, fetch a few more from that category
  useEffect(() => {
    if (!product?.category?.slug) {
      setRelated([]);
      return;
    }
    let cancelled = false;

    apiRequest(
      `/products?category=${product.category.slug}&limit=5&sort=newest`
    )
      .then((data) => {
        if (cancelled) return;
        setRelated(
          data.products.filter((p) => p._id !== product._id).slice(0, 4)
        );
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      });

    return () => {
      cancelled = true;
    };
  }, [product]);

  if (loading) {
    return (
      <main className="pd-page">
        <p className="pd-status">Loading product...</p>
      </main>
    );
  }

  if (notFound) {
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

  if (error) {
    return (
      <main className="pd-page">
        <p className="pd-status pd-status--error">{error}</p>
      </main>
    );
  }

  const liked = isWishlisted(product._id);
  const outOfStock = product.stock === 0;
  const images = product.images.length
    ? product.images
    : [{ url: fallbackImg }];

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () =>
    setQuantity((q) => Math.min(Math.min(product.stock, 10), q + 1));

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/Login");
      return;
    }
    setCartError("");
    setAddingToCart(true);
    try {
      await addToCart(product._id, {
        size: selectedSize,
        color: selectedColor,
        quantity,
      });
    } catch (err) {
      setCartError(err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistClick = () => {
    if (!isLoggedIn) {
      navigate("/Login");
      return;
    }
    setWishlistError("");
    toggleWishlist(product._id).catch((err) => setWishlistError(err.message));
  };

  return (
    <main className="pd-page">
      <section className="pd-product">
        <div className="pd-gallery">
          <img
            className="pd-gallery__image"
            src={images[activeImage]?.url || fallbackImg}
            alt={product.name}
          />
          {images.length > 1 && (
            <div className="pd-thumbnails">
              {images.map((img, i) => (
                <button
                  key={img._id || i}
                  className={`pd-thumbnail ${activeImage === i ? "is-active" : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img.url} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          <h1 className="pd-info__title">{product.name}</h1>
          <StarRating value={product.rating} count={product.numReviews} />

          <p className="pd-info__price">${product.price}</p>

          <p className="pd-info__description">{product.description}</p>

          {product.colors.length > 0 && (
            <div className="pd-option">
              <span className="pd-option__label">
                Color <em>{selectedColor}</em>
              </span>
              <div className="pd-swatches">
                {product.colors.map((color) => (
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
          )}

          {product.sizes.length > 0 && (
            <div className="pd-option">
              <span className="pd-option__label">Size</span>
              <div className="pd-sizes">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`pd-size ${selectedSize === size ? "is-selected" : ""}`}
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pd-purchase-row">
            <div className="pd-qty">
              <button
                aria-label="Decrease quantity"
                onClick={decrement}
                disabled={outOfStock}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={increment}
                disabled={outOfStock}
              >
                +
              </button>
            </div>
            <button
              className="pd-add-to-cart"
              onClick={handleAddToCart}
              disabled={outOfStock || addingToCart}
            >
              {outOfStock
                ? "Out of Stock"
                : addingToCart
                  ? "Adding..."
                  : "Add to Cart"}
            </button>
          </div>
          {cartError && <p className="pd-cart-error">{cartError}</p>}

          <div className="pd-secondary-actions">
            <button
              className={`pd-link-btn ${liked ? "is-active" : ""}`}
              onClick={handleWishlistClick}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              {liked ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>
            <button className="pd-link-btn">
              <Share2 size={16} /> Share
            </button>
          </div>
          {wishlistError && <p className="pd-cart-error">{wishlistError}</p>}

          <div className="pd-accordions">
            <Accordion title="Product Details">{product.description}</Accordion>
            <Accordion title="Size & Fit">
              True to size. For a looser fit, consider ordering one size up.
            </Accordion>
            <Accordion title="Shipping & Returns">
              Free standard shipping on orders over $50. Easy 30-day returns on
              unworn items with tags attached.
            </Accordion>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="pd-related">
          <h2 className="pd-related__heading">You may also like</h2>
          <div className="pd-related__grid">
            {related.map((item) => (
              <button
                key={item._id}
                className="pd-related-card"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <div className="pd-related-card__image-wrap">
                  <img
                    src={item.images[0]?.url || fallbackImg}
                    alt={item.name}
                  />
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