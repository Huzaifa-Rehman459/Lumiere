import React from 'react'
import "./ContactPage.css"
import { MapPin, Mail, Phone, Clock, ArrowRight } from 'lucide-react'

const ContactPage = () => {
  return (
    <div className='contact-page'>
      <div className="contact-left">
        <h1>Lets Talk</h1>
        <div className="info-details">
            <div className="info-box">
            <MapPin />
            <div className="info-text">
                <h3>Visit Us</h3>
                <span>Lumière Studio<br></br>Faisalabad, Pakistan</span>
            </div>
        </div>
        <div className="info-box">
            <Mail />
            <div className="info-text">
                <h3>Email Us</h3>
                <span>hello@lumiere.com</span>
            </div>
        </div>
        <div className="info-box">
            <Phone />
            <div className="info-text">
                <h3>Call Us</h3>
                <span>+92 300 1234567</span>
            </div>
        </div>
        <div className="info-box">
            <Clock />
            <div className="info-text">
                <h3>Opening Hours</h3>
                <span>Monday - Saturday<br></br>10AM - 6PM</span>
            </div>
        </div>
        </div>
      </div>
      <div className="contact-right">
        <h2>Send us a message</h2>
        <form>
            <div className="input-box">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name"></input>
            </div>
            <div className="input-box">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com"></input>
            </div>
            <div className="input-box">
              <label>Subject</label>
              <input type="text" placeholder="Enter your subject"></input>
            </div>
            <div className="input-box">
              <label>Message</label>
              <textarea placeholder='Type your message here...'></textarea>
            </div>
            <button>Send Message<ArrowRight size={15} /></button>
        </form>
      </div>
    </div>
  )
}

export default ContactPage
