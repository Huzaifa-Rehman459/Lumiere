import React from 'react'
import "./AboutReview.css"
import { HeartHandshake, Shirt, Star } from 'lucide-react'

const AboutReview = () => {
  return (
    <div className='review-box-container'>
      <div className="review-box">
        <div className="icon">
            <HeartHandshake size={25} />
        </div>
        <h2>100K+</h2>
        <p>Happy Customers</p>
      </div>
      <div className="review-box">
        <div className="icon">
            <Shirt size={25} />
        </div>
        <h2>500+</h2>
        <p>Style Collections</p>
      </div>
      <div className="review-box">
        <div className="icon">
            <Star size={25} />
        </div>
        <h2>4.8/5</h2>
        <p>Customer Rating</p>
      </div>
    </div>
  )
}

export default AboutReview
