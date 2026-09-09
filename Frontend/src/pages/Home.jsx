import React from 'react'
import Hero from '../components/Hero/Hero'
import Details from '../components/Details/Details'
import BestSeller from '../components/BestSeller/BestSeller'
import Banner from '../components/Banner/Banner'

const Home = () => {
  return (
    <div>
      <Hero />
      <Details />
      <BestSeller />
      <Banner />
    </div>
  )
}

export default Home
