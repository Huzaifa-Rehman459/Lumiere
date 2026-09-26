import React from 'react'
import "./BestSeller.css"
import { MoveRight } from 'lucide-react'
import bestSeller from "../../assets/assets"
import ProductCard from "../ProductCard/ProductCard"

const BestSeller = () => {

  return (
    <div className='seller-page'>
      <div className="seller-header">
        <h2>Best Sellers</h2>
        <a href="">View All<MoveRight size={18} /></a>
      </div>
      <div className="seller-cards">
        {bestSeller.map((item) => (
        <ProductCard key={item.id} id={item.id} image={item.image} name={item.name} price={item.price} oldPrice={item.oldPrice} />
      ))}
      </div>
    </div>
  )
}

export default BestSeller