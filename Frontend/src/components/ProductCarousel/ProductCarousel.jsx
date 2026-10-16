import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductCarousel.css";

const ProductCarousel = ({ title, viewAllLink, products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="product-carousel">
      <div className="carousel-header">
        <h2>{title}</h2>
        <Link to={viewAllLink}>
          View All <MoveRight size={16} />
        </Link>
      </div>
      <div className="carousel-track">
        {products.map((item) => (
          <div className="carousel-item" key={item._id}>
            <ProductCard
              id={item._id}
              image={item.images[0]?.url}
              name={item.name}
              price={item.price}
              compareAtPrice={item.compareAtPrice}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;