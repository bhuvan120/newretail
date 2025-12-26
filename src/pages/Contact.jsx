import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <main className="contact-page">
      
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p>We’d love to hear from you</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-container">
        
        {/* Info */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Have questions about our products or services?  
            Reach out and our team will respond shortly.
          </p>

          <ul>
            <li><strong>Email:</strong> support@vajraretails.com</li>
            <li><strong>Phone:</strong> +91 98765 43210</li>
            <li><strong>Location:</strong> Hyderabad, India</li>
          </ul>
        </div>

        {/* Form */}
        <div className="contact-form">
          <h2>Send a Message</h2>

          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="4" required></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>

      </section>
    </main>
  );
};

export default Contact;
