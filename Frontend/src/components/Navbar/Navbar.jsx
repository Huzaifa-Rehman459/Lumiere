import { useState } from "react";
import { Search, Heart, ShoppingBag, UserRound, Menu, X } from "lucide-react";
import "./Navbar.css"
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="navbar">
      <div className="left-nav">
        <div className="logo">
          <h1>Lumière</h1>
        </div>
      </div>

      <div className="center-nav">
        <ul>
          <Link to="/">Home</Link>
          <Link to="/ShopAll">Shop</Link>
          <Link to="/Categories">Categories</Link>
          <Link to="/About">About</Link>
          <Link to="/Contact">Contact</Link>
        </ul>
      </div>

      <div className="right-nav">
        <ul>
          <Link to=""><Search /></Link>
          <Link to="/Wishlist"><Heart /></Link>
          <Link to="/Cart"><ShoppingBag /></Link>
          <Link to="/Login"><UserRound /></Link>
        </ul>
      </div>

      {/* Hamburger icon */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="mobile-menu">
          <ul className="mobile-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="ShopAll">Shop</Link></li>
            <li><Link to="/Categories">Categories</Link></li>
            <li><Link to="/About">About</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
          </ul>

          <div className="mobile-icons">
            <Link to=""><Search /></Link>
            <Link to="/Wishlist"><Heart /></Link>
            <Link to="/Cart"><ShoppingBag /></Link>
            <Link to="/Login"><UserRound /></Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;