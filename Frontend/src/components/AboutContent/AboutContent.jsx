import React from 'react'
import "./AboutContent.css"
import aboutCeo from "../../assets/about-ceo.jpg"

const AboutContent = () => {
  return (
    <div className='about-content'>
      <div className="content-container">
        <img src={aboutCeo} loading='lazy'></img>
        <div className="content-container-text">
            <h1>Our Story</h1>
            <p>Lumière was created from a simple belief: fashion should feel as beautiful as it looks. We wanted to create a space where modern women could discover timeless pieces that reflect their individuality, confidence, and personal style. From effortless everyday essentials to elegant statement pieces, every collection is thoughtfully selected with quality, comfort, and sophistication in mind. Lumière is more than just clothing it’s about feeling confident, expressing yourself, and finding a style that truly feels like you.</p>
        </div>
      </div>
    </div>
  )
}

export default AboutContent
