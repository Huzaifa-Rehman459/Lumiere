import { useState, useEffect } from "react";
import "./ShopByCategory.css";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";
import fallbackImg from "../../assets/dress-img-1.jpg";

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    apiRequest("/categories")
      .then((data) => {
        if (!cancelled) setCategories(data.categories);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="category-status">Loading categories...</p>;
  if (error)
    return <p className="category-status category-status--error">{error}</p>;
  if (categories.length === 0) {
    return <p className="category-status">No categories yet.</p>;
  }

  const [featured, ...rest] = categories;

  return (
    <div className="shop-category">
      <Link to={`/shop/${featured.slug}`} className="category-featured">
        <div className="category-featured-image">
          <img src={featured.image?.url || fallbackImg} alt={featured.name} />
        </div>
        <div className="category-featured-info">
          <span>Featured</span>
          <h2>{featured.name}</h2>
          <p>
            {featured.description ||
              `Explore our ${featured.name.toLowerCase()} collection.`}
          </p>
          <span className="category-featured-link">
            Shop {featured.name} <ArrowRight size={16} />
          </span>
        </div>
      </Link>

      {rest.length > 0 && (
        <div className="category-grid">
          {rest.map((item) => (
            <Link
              to={`/shop/${item.slug}`}
              className="category-card"
              key={item._id}
            >
              <div className="category-image">
                <img src={item.image?.url || fallbackImg} alt={item.name} />
              </div>
              <div className="category-info">
                <h3>{item.name}</h3>
                <p>
                  {item.description ||
                    `Shop our ${item.name.toLowerCase()} collection.`}
                </p>
                <span className="category-link">
                  Shop {item.name} <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopByCategory;