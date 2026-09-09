import React from "react";
import { MoveRight } from "lucide-react";
import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero-page">
      <div className="hero-text">
        <div className="hero-main-text">
          <p>New Season</p>
          <h1>
            Style that <br></br>feels like you
          </h1>
        </div>
        <span>
          Discover the latest trends in women's tashion,<br></br> From casuals to
          classics, find your perfect look.
        </span>
        <button>Shop Now<MoveRight /></button>
      </div>
    </div>
  );
};

export default Hero;
