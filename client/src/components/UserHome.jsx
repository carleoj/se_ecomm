import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './styles/UserHome.css';
import products from '../data/Products';

const UserHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const productGridRef = useRef(null);

  const renderedProducts = useMemo(() => {
    return products.map(product => (
      <div className="uh-product-card" key={product._id}>
        <img loading="lazy" src={product.image} alt={product.name || "Food item"} className="uh-product-image" />
        <h3 className="uh-product-name">{product.name}</h3>
        <div className="uh-product-rating">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < product.rating ? '#f5c518' : '#ddd' }}>★</span>
          ))}
          <span className="uh-product-review-count">({product.numReview})</span>
        </div>
        <p className="uh-product-description">{product.description}</p>
        <p className="uh-product-price">${product.price}</p>
        <button className="uh-product-button">Add to Cart</button>
      </div>
    ));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/", { replace: true });
    } else {
      setLoading(false);
    }

    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => window.history.go(1);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/", { replace: true });
  };

  if (loading) return null;

  const handleNavigation = (route) => {
    // Navigate to the corresponding route under '/user-home'
    navigate(`/user-home/${route}`);
  };

  return (
    <div className="uh-container">
      <div className="uh-navbar">
        <h1 className="uh-navbar-title">Foodini</h1>

        <button
          className="uh-hamburger"
          onClick={() => setIsMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <div className={`uh-navbar-links ${isMenuOpen ? "open" : ""}`}>
          <button className="uh-navbar-btn" onClick={() => handleNavigation('shop')}>Shop</button>
          <button className="uh-navbar-btn" onClick={() => handleNavigation('orders')}>Orders</button>
          <button className="uh-navbar-btn" onClick={() => handleNavigation('account')}>Account</button>
        </div>

        <button onClick={handleLogout} className="uh-logout-btn">Logout</button>
      </div>

      <div className="uh-dashboard">
        <h2 className="uh-dashboard-heading">Welcome, User!</h2>
        <div className="uh-dashboard-content">
          <p>Explore your orders, manage your account, and browse our delicious food items!</p>
        </div>

        <div className="uh-product-scroll-container">
          <button className="uh-scroll-button left" onClick={() => productGridRef.current.scrollLeft -= 300}>{"<"}</button>
          <div className="uh-product-grid" ref={productGridRef}>
            {renderedProducts}
          </div>
          <button className="uh-scroll-button right" onClick={() => productGridRef.current.scrollLeft += 300}>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
