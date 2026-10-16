import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";
import heroImg from "../../assets/hero-bg.png";
import "./Hero.css";

const Hero = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiRequest("/categories")
      .then((data) => setCategories(data.categories.slice(0, 5)))
      .catch((err) => console.error("Could not load categories:", err.message));
  }, []);

  return (
    <section className="hero">
      <div className="hero-row">
        <div className="hero-copy">
          <h1>
            Clothes you'll
            <br />
            actually wear
          </h1>
          <p>
            Thoughtful pieces in fabrics that last, priced the way they should
            be.
          </p>
          <Link to="/ShopAll" className="hero-cta">
            Shop the collection
          </Link>
        </div>

        <div className="hero-figure">
          <div className="hero-figure-mat" aria-hidden="true" />
          <img src={heroImg} alt="New arrivals from Lumière" />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="hero-rail">
          <span className="hero-rail-label">Shop by category</span>
          <nav className="hero-rail-links">
            {categories.map((cat) => (
              <Link key={cat._id} to={`/shop/${cat.slug}`}>
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </section>
  );
};

export default Hero;