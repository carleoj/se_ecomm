import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";  // Import Link
import './styles/UserHome.css';
import products from '../data/Products';

const UserHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderedProducts = products.map(product => (
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

  return (
    <div className="uh-container">
      <div className="uh-navbar">
      <Link className="uh-navbar-btn brand" to="/user-home">Foodini</Link>


        <button
          className="uh-hamburger"
          onClick={() => setIsMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <div className={`uh-navbar-links ${isMenuOpen ? "open" : ""}`}>
        <Link className="uh-navbar-btn" to="/user-home">Shop</Link>
          <Link className="uh-navbar-btn" to="/orders">Orders</Link>  {/* Changed to Link */}
          <Link className="uh-navbar-btn" to="/account">Account</Link>  {/* Changed to Link */}
        </div>

        <button onClick={handleLogout} className="uh-logout-btn">Logout</button>
      </div>

      <div className="uh-dashboard">
        <h2 className="uh-dashboard-heading">Welcome, User!</h2>
        <div className="uh-dashboard-content">
          <p>Explore your orders, manage your account, and browse our delicious food items!</p>
        </div>

        <div className="uh-product-scroll-container">
          <button className="uh-scroll-button left" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>{"<"}</button>
          <div className="uh-product-grid">
            {renderedProducts}
          </div>
          <button className="uh-scroll-button right" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
