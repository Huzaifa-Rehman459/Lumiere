import React from 'react'
import "./Banner.css"
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
   <div className="banner">
     <div className='ad-banner'>
      <div className="ad-banner-text">
        <h2>New Arrivals</h2>
        <h1>Fresh styles for<br></br>every occasion</h1>
        <Link to="/shop">
          <a href=''>Shop new arrivals<MoveRight size={15} /></a>
        </Link>
      </div>
    </div>
   </div>
  )
}

export default Banner
