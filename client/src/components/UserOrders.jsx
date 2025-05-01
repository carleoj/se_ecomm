import React from 'react'
import { useNavigate } from "react-router-dom";

const UserOrders = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className='uh-container'>
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
          <button className="uh-navbar-btn" onClick={() => navigate('/user-home')}>Shop</button>
          <button className="uh-navbar-btn" onClick={() => navigate('/orders')}>Orders</button>
          <button className="uh-navbar-btn" onClick={() => navigate('/account')}>Account</button>
        </div>

        <button onClick={handleLogout} className="uh-logout-btn">Logout</button>
      </div>
    </div>
  )
}

export default UserOrders