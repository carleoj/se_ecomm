import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import OrderTable from '../components/OrderTable'; // adjust path as needed

const UserOrders = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="uh-container">
      <div className="uh-navbar">
        <Link className="uh-navbar-btn brand" to="/user-home">Foodini</Link>
        <button className="uh-hamburger" onClick={() => setIsMenuOpen(prev => !prev)} aria-label="Toggle navigation menu">☰</button>
        <div className={`uh-navbar-links ${isMenuOpen ? "open" : ""}`}>
          <Link className="uh-navbar-btn" to="/user-home">Shop</Link>
          <Link className="uh-navbar-btn" to="/orders">Orders</Link>
          <Link className="uh-navbar-btn" to="/account">Account</Link>
        </div>
        <button onClick={() => {
          localStorage.removeItem("authToken");
          navigate("/", { replace: true });
        }} className="uh-logout-btn">Logout</button>
      </div>

      <div className="uh-dashboard">
        <h2 className="uh-dashboard-heading">Your Orders</h2>
        <div className="uh-dashboard-content">
          <p>Here you can view your past orders.</p>
          <OrderTable />
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
