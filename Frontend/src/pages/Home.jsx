import React from 'react'
import Hero from '../components/Hero/Hero'
import Details from '../components/Details/Details'
import BestSeller from '../components/BestSeller/BestSeller'
import Banner from '../components/Banner/Banner'
import Footer from "../components/Footer/Footer";

const Home = () => {
  return (
    <div>
      <Hero />
      <Details />
      <BestSeller />
      <Banner />
      <Footer />
    </div>
  )
}

export default Home
