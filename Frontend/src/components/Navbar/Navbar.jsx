import { useState, useEffect, useRef } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  MessageCircle,
  Truck,
} from "lucide-react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/client";
import { WHATSAPP_NUMBER } from "../../config/contact";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      apiRequest(`/products?search=${encodeURIComponent(query)}&limit=5`)
        .then((data) => setResults(data.products))
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleUserClick = () => {
    if (isLoggedIn) {
      logout();
      navigate("/");
    } else {
      navigate("/Login");
    }
  };

  const SearchBox = (
    <div className="navbar-search" ref={searchRef}>
      <button onClick={() => setSearchOpen((o) => !o)}>
        <Search />
      </button>
      {searchOpen && (
        <div className="search-dropdown">
          <input
            autoFocus
            placeholder="Search dresses, tops..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {results.length > 0 && (
            <div className="search-results">
              {results.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  className="search-result-item"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                >
                  <img src={p.images[0]?.url} alt={p.name} />
                  <div>
                    <p>{p.name}</p>
                    <span>${p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

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
          <Link to="/OrderTracking">Track Order</Link>
          <Link to="/About">About</Link>
          <Link to="/Contact">Contact</Link>
        </ul>
      </div>

      <div className="right-nav">
        <ul>
          {SearchBox}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            title="Chat with us on WhatsApp"
            className="navbar-whatsapp"
          >
            <MessageCircle />
          </a>
          <Link to="/Wishlist">
            <Heart />
          </Link>
          <Link to="/Cart">
            <ShoppingBag />
          </Link>
          <button
            className="navbar-icon-btn"
            onClick={handleUserClick}
            title={isLoggedIn ? `Log out (${user.fullName})` : "Login"}
          >
            <UserRound />
          </button>
        </ul>
      </div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </div>

      {isOpen && (
        <div className="mobile-menu">
          <ul className="mobile-links">
            <li>
              <Link to="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/ShopAll" onClick={() => setIsOpen(false)}>
                Shop
              </Link>
            </li>
            <li>
              <Link to="/Categories" onClick={() => setIsOpen(false)}>
                Categories
              </Link>
            </li>
            <li>
              <Link to="/OrderTracking" onClick={() => setIsOpen(false)}>
                <Truck size={16} /> Track Order
              </Link>
            </li>
            <li>
              <Link to="/About" onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/Contact" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>

          <div className="mobile-icons">
            <Link to="/Wishlist" onClick={() => setIsOpen(false)}>
              <Heart />
            </Link>
            <Link to="/Cart" onClick={() => setIsOpen(false)}>
              <ShoppingBag />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="navbar-whatsapp"
            >
              <MessageCircle />
            </a>
            <button className="navbar-icon-btn" onClick={handleUserClick}>
              <UserRound />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;