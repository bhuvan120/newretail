import React, { useState } from "react";
import productsData from "../data/products";
import "./productscard.css";

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [department, setDepartment] = useState("All");

  const filteredProducts = productsData.filter((p) => {
    const matchesSearch =
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.product_brand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =      category === "All" || p.product_category === category;

    const matchesDepartment =
      department === "All" || p.product_department === department;

    return matchesSearch && matchesCategory && matchesDepartment;
  });

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4 text-center">Products</h2>

      {/* 🔍 Filters */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Accessories">Accessories</option>
            <option value="Swim">Swim</option>
            <option value="Active">Active</option>
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>
      </div>

      {/* 🛒 Product Cards */}
      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div className="col-md-4 col-lg-3" key={product.product_id}>
            <div className="card product-card h-100">
              <img
                src={product.product_img}
                className="card-img-top"
                alt={product.product_name}
              />

              <div className="card-body d-flex flex-column">
                <h6 className="fw-semibold">
                  {product.product_name}
                </h6>

                <p className="text-muted small mb-1">
                  {product.product_category} • {product.product_department}
                </p>

                <p className="fw-bold mb-2">
                  ${product.selling_unit_price}
                </p>

                <button className="btn btn-outline-primary mt-auto">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <p className="text-center text-muted mt-5">
            No products found
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
