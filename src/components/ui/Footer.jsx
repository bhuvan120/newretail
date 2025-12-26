import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <img src="image.png" alt="Vajra Retails Logo" />
          <p>
            Vajra Retails is your trusted destination for quality products,
            secure shopping, and fast delivery.
          </p>
        </div>

        {/* Links */}
        <div className="footer-section">
          <h4>Company</h4>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <a href="/terms">Terms & Conditions</a>
          <a href="#">Help Center</a>
          <a href="#">Returns</a>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        © 2025 Vajra Retails. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
