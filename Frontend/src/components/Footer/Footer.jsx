import React from 'react'
import "./Footer.css"
import { Search, Heart, ShoppingBag, UserRound } from "lucide-react";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-content">
        <div className="footer-logo">
            <h1>Lumière</h1>
        </div>
        <div className="footer-links">
            <ul>
                <Link to="/">Home</Link>
                <Link to="">Shop</Link>
                <Link to="">About</Link>
                <Link to="">Contact</Link>
            </ul>
        </div>
        <div className="footer-social-links">
            <ul>
          <Link to=""><Search /></Link>
          <Link to=""><Heart /></Link>
          <Link to=""><ShoppingBag /></Link>
          <Link to="/Login"><UserRound /></Link>
        </ul>
        </div>
        <div className="footer-copy-right">
            <span>© 2026 Lumière, All rights reserved.</span>
        </div>
      </div>
    </div>
  )
}

export default Footer
