import React from "react";
import "./Home.css";

const products = [
  {
    id: 1,
    name: "Men T-Shirt",
    price: "₹799",
    image: "https://tse1.mm.bing.net/th/id/OIP.nplhNqrv0igsr-ydbQl6VQHaJc?pid=Api&P=0&h=180"
  },
  {
    id: 2,
    name: "Women Dress",
    price: "₹1,499",
    image: "https://i5.walmartimages.com/asr/4f0f511a-e097-4d8c-8e2c-977fd6fff53f_1.355b06c6f07b61138cdd66496bd074fc.jpeg"
  },
  {
    id: 3,
    name: "Footwear",
    price: "₹1,999",
    image: "https://tse4.mm.bing.net/th/id/OIP.Y5dpT1xu59gPAlMzB8mJ5QHaFB?pid=Api&P=0&h=180"
  },
  {
    id: 4,
    name: "Accessories",
    price: "₹499",
    image: "https://roadtovrlive-5ea0.kxcdn.com/wp-content/uploads/2022/10/meta-quest-pro-1-1021x580.jpg"
  }
];

const Home = () => {
  return (
    <main>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>Vajra Retails</h1>
          <p>Smart Shopping. Better Living.</p>
          <button className="btn btn-primary btn-lg">
            Shop Now
          </button>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="trust-item">🚚 Free Delivery</div>
        <div className="trust-item">🔒 Secure Payments</div>
        <div className="trust-item">↩ Easy Returns</div>
        <div className="trust-item">⭐ Trusted by 10K+ Customers</div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          <div className="category-card">Men</div>
          <div className="category-card">Women</div>
          <div className="category-card">Kids</div>
          <div className="category-card">Accessories</div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {products.map((item) => (
            <div className="product-card" key={item.id}>
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <p>{item.price}</p>
              <button className="btn btn-outline-primary btn-sm">
                View Product
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* OFFER SECTION */}
      <section className="offer-section">
        <h2>Special Offer</h2>
        <p>Flat 20% OFF on your first order</p>
        <button className="btn btn-dark">
          Grab Deal
        </button>
      </section>

      {/* WHY US */}
      <section className="why-us">
        <h2>Why Choose Vajra Retails?</h2>
        <div className="why-grid">
          <div className="why-card">
            <h4>Quality Products</h4>
            <p>Handpicked products from trusted brands.</p>
          </div>
          <div className="why-card">
            <h4>Affordable Prices</h4>
            <p>Best prices without compromising quality.</p>
          </div>
          <div className="why-card">
            <h4>Fast Support</h4>
            <p>24/7 customer support for your needs.</p>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;
