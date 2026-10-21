import { useState, useEffect } from "react";
import "./AboutReview.css";
import { Shirt, Grid2X2, Sparkles } from "lucide-react";
import { apiRequest } from "../../api/client";

const AboutReview = () => {
  const [productCount, setProductCount] = useState(null);
  const [categoryCount, setCategoryCount] = useState(null);

  useEffect(() => {
    apiRequest("/products?limit=1")
      .then((data) => setProductCount(data.total))
      .catch(() => setProductCount(null));

    apiRequest("/categories")
      .then((data) => setCategoryCount(data.categories.length))
      .catch(() => setCategoryCount(null));
  }, []);

  return (
    <div className="review-box-container">
      <div className="review-box">
        <div className="icon">
          <Shirt size={25} />
        </div>
        <h2>{productCount !== null ? productCount : "—"}</h2>
        <p>Products Available</p>
      </div>

      <div className="review-box">
        <div className="icon">
          <Grid2X2 size={25} />
        </div>
        <h2>{categoryCount !== null ? categoryCount : "—"}</h2>
        <p>Curated Categories</p>
      </div>

      <div className="review-box">
        <div className="icon">
          <Sparkles size={25} />
        </div>
        <h2 className="review-box-text-stat">Thoughtfully Curated</h2>
        <p>Every piece, chosen with care</p>
      </div>
    </div>
  );
};

export default AboutReview;