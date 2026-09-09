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
          <Link to="">Shop</Link>
          <Link to="">Categories</Link>
          <Link to="">About</Link>
          <Link to="">Contact</Link>
        </ul>
      </div>

      <div className="right-nav">
        <ul>
          <Link to=""><Search /></Link>
          <Link to=""><Heart /></Link>
          <Link to=""><ShoppingBag /></Link>
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
            <li><Link to="">Shop</Link></li>
            <li><Link to="">Categories</Link></li>
            <li><Link to="">About</Link></li>
            <li><Link to="">Contact</Link></li>
          </ul>

          <div className="mobile-icons">
            <Link to=""><Search /></Link>
            <Link to=""><Heart /></Link>
            <Link to=""><ShoppingBag /></Link>
            <Link to="/Login"><UserRound /></Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;