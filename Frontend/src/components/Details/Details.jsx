import React from 'react'
import "./Details.css"
import { Truck, RotateCcw, Lock, ShieldCheck } from "lucide-react"

const Details = () => {
  return (
    <div className='details-page'>
      <div className="details-box">
        <div className="icon">
            <Truck size={30} />
        </div>
        <div className="details-text">
            <h2>Free Shipping</h2>
            <p>On orders over $50</p>
        </div>
      </div>
      <div className="details-box">
        <div className="icon">
            <RotateCcw size={30} />
        </div>
        <div className="details-text">
            <h2>Easy Returns</h2>
            <p>Not satisfied? Return it for free.</p>
        </div>
      </div>
      <div className="details-box">
        <div className="icon">
            <Lock size={30} />
        </div>
        <div className="details-text">
            <h2>Secure Payments</h2>
            <p>100% secure checkout</p>
        </div>
      </div>
      <div className="details-box">
        <div className="icon">
            <ShieldCheck size={30} />
        </div>
        <div className="details-text">
            <h2>24/7 Support</h2>
            <p>We are here for help</p>
        </div>
      </div>
    </div>
  )
}

export default Details