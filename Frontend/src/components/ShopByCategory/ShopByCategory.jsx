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
  if (error) return <p className="category-status category-status--error">{error}</p>;
  if (categories.length === 0) {
    return <p className="category-status">No categories yet.</p>;
  }

  return (
    <div className="shop-category">
      <div className="category-header">
        <h2>Shop By Category</h2>
        <p>Explore our top categories and find your next favorite piece.</p>
      </div>

      <div className="category-grid">
        {categories.map((item) => (
          <div className="category-card" key={item._id}>
            <Link to={`/shop/${item.slug}`} className="category-image">
              <img src={item.image?.url || fallbackImg} alt={item.name} />
            </Link>
            <div className="category-info">
              <h3>{item.name}</h3>
              <p>{item.description || `Shop our ${item.name.toLowerCase()} collection.`}</p>
              <Link to={`/shop/${item.slug}`}>
                Shop {item.name} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByCategory;