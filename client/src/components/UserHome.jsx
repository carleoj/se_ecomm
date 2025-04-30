import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/UserHome.css';
import products from '../data/Products'

const UserHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/", { replace: true });
    } else {
      setLoading(false);
      fetch("https://se-ecomm.onrender.com/api/products")
        .then(res => res.json())
        .then(data => setProducts(data));
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
        <h1 className="uh-navbar-title">Foodini</h1>
        <div className="uh-navbar-links">
          <button className="uh-navbar-btn" onClick={() => navigate('/shop')}>Shop</button>
          <button className="uh-navbar-btn" onClick={() => navigate('/orders')}>Orders</button>
          <button className="uh-navbar-btn" onClick={() => navigate('/account')}>Account</button>
        </div>
        <button onClick={handleLogout} className="uh-logout-btn">Logout</button>
      </div>

      <div className="uh-dashboard">
        <h2 className="uh-dashboard-heading">Welcome, User!</h2>
        <div className="uh-dashboard-content">
          <p>Explore your orders, manage your account, and browse our delicious food items!</p>
        </div>

        <div className="uh-product-grid">
          {products.map(product => (
            <div className="uh-product-card" key={product._id}>
              <img src={product.image} alt={product.name} className="uh-product-image" />
              <h3 className="uh-product-name">{product.name}</h3>
              <p className="uh-product-price">${product.price}</p>
              <button className="uh-product-button">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserHome;
