import React from "react";
import "./About.css";

const About = () => {
  return (
    <main className="about-page">
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Vajra Retails</h1>
          <p>Your trusted retail shopping destination</p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="about-content">
        <div className="about-card">
          <h2>Who We Are</h2>
          <p>
            Vajra Retails is a customer-centric e-commerce platform designed to
            make online shopping simple, affordable, and reliable. We bring
            quality products from trusted sellers directly to your doorstep.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            Our mission is to empower customers by offering a seamless shopping
            experience with transparent pricing, secure payments, and fast
            delivery—all through an easy-to-use digital platform.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Vision</h2>
          <p>
            We aim to become a trusted retail brand by continuously improving
            technology, expanding product categories, and building long-term
            relationships with our customers.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <h2>Our Core Values</h2>

        <div className="values-grid">
          <div className="value-card">
            <h4>Customer First</h4>
            <p>
              Every decision we make is focused on improving customer
              satisfaction and trust.
            </p>
          </div>

          <div className="value-card">
            <h4>Quality Assurance</h4>
            <p>
              We ensure that all products meet quality standards before reaching
              customers.
            </p>
          </div>

          <div className="value-card">
            <h4>Transparency</h4>
            <p>
              Clear pricing, honest policies, and no hidden costs.
            </p>
          </div>

          <div className="value-card">
            <h4>Innovation</h4>
            <p>
              We continuously improve our platform using modern technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-choose">
        <div className="about-card">
          <h2>Why Choose Vajra Retails?</h2>
          <ul>
            <li>✔ Secure and simple checkout process</li>
            <li>✔ Easy returns and refunds</li>
            <li>✔ Wide range of retail products</li>
            <li>✔ Reliable customer support</li>
          </ul>
        </div>
      </section>

    </main>
  );
};

export default About;
