import { Search, Heart, ShoppingBag, UserRound, Menu, X } from "lucide-react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { apiRequest } from "../../api/client";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (isLoggedIn) {
      logout();
      navigate("/");
    } else {
      navigate("/Login");
    }
  };

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
    }, 300); // debounce so it doesn't fire on every keystroke

    return () => clearTimeout(timer);
  }, [query]);

  // Close the dropdown if you click outside it
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

      {/* Hamburger icon */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="mobile-menu">
          <ul className="mobile-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="ShopAll">Shop</Link>
            </li>
            <li>
              <Link to="/Categories">Categories</Link>
            </li>
            <li>
              <Link to="/About">About</Link>
            </li>
            <li>
              <Link to="/Contact">Contact</Link>
            </li>
          </ul>

          <div className="mobile-icons">
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
            <Link to="/Wishlist">
              <Heart />
            </Link>
            <Link to="/Cart">
              <ShoppingBag />
            </Link>
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