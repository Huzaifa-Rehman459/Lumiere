import { useState } from "react";
import "./ContactPage.css";
import { MapPin, Mail, Phone, Clock, ArrowRight } from "lucide-react";
import { CONTACT_EMAIL } from "../../config/contact";

const ContactPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = `From: ${form.fullName} (${form.email})\n\n${form.message}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      form.subject || "Message from the Lumière site",
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="contact-page">
      <div className="contact-left">
        <h1>Let's Talk</h1>
        <div className="info-details">
          <div className="info-box">
            <MapPin />
            <div className="info-text">
              <h3>Visit Us</h3>
              <span>
                Lumière Studio
                <br />
                Faisalabad, Pakistan
              </span>
            </div>
          </div>
          <div className="info-box">
            <Mail />
            <div className="info-text">
              <h3>Email Us</h3>
              <span>{CONTACT_EMAIL}</span>
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
              <span>
                Monday – Saturday
                <br />
                10AM – 6PM
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-right">
        <h2>Send us a message</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label>Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <label>Subject</label>
            <input
              name="subject"
              type="text"
              placeholder="Enter your subject"
              value={form.subject}
              onChange={handleChange}
            />
          </div>
          <div className="input-box">
            <label>Message</label>
            <textarea
              name="message"
              placeholder="Type your message here..."
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">
            Send Message <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;