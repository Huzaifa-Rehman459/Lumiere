import { useState, useEffect } from "react";
import "./BestSeller.css";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";
import ProductCard from "../ProductCard/ProductCard";

const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    apiRequest("/products?bestSeller=true&limit=4&sort=newest")
      .then((data) => {
        if (!cancelled) setProducts(data.products);
      })
      .catch((err) => console.error("Could not load best sellers:", err.message))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <div className="seller-page">
      <div className="seller-header">
        <h2>Best Sellers</h2>
        <Link to="/ShopAll">
          View All <MoveRight size={18} />
        </Link>
      </div>
      <div className="seller-cards">
        {products.map((item) => (
          <ProductCard
            key={item._id}
            id={item._id}
            image={item.images[0]?.url}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;