import React from 'react';
import "./ShopByCategory.css";
import { ArrowRight } from "lucide-react";
import { categories } from "../../assets/assets.js";
import { Link } from "react-router-dom";

const ShopByCategory = () => {
  return (
    <div className="shop-category">
      <div className="category-header">
        <h2>Shop By Category</h2>
        <p>Explore our top categories and find your next favorite piece.</p>
      </div>

      <div className="category-grid">
        {categories.map((item) => (
          <div className="category-card" key={item.id}>
            <Link to={`/shop/${item.slug}`} className="category-image">
              <img src={item.image} alt={item.title} />
            </Link>
            <div className="category-info">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link to={`/shop/${item.slug}`}>
                {item.link} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByCategory;