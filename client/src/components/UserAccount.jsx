import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './styles/UserHome.css';

const UserAccount = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', shippingAddress: { address: '', city: '', postalCode: '', country: '' }
  });
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("https://se-ecomm.onrender.com/api/users/profile", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        });

        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();

        setUserData(data);
        setFormData({
          name: data.name,
          email: data.email,
          shippingAddress: data.shippingAddress || {
            address: '', city: '', postalCode: '', country: ''
          }
        });
      } catch (err) {
        localStorage.removeItem("authToken");
        navigate("/", { replace: true });
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["address", "city", "postalCode", "country"].includes(name)) {
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://se-ecomm.onrender.com/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      setUserData(data);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Error updating profile.");
    }
  };

  return (
    <div className="uh-container">
      <div className="uh-navbar">
        <Link className="uh-navbar-btn brand" to="/user-home">Foodini</Link>
        <button className="uh-hamburger" onClick={() => setIsMenuOpen(prev => !prev)}>☰</button>
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
        <h2 className="uh-dashboard-heading">Account Information</h2>
        <div className="uh-dashboard-content">
          {message && <p className="uh-message">{message}</p>}

          <form onSubmit={handleUpdate} className="uh-account-form">
            <label>Name:
              <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
            </label>
            <label>Email:
              <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />
            </label>
            <fieldset>
              <legend>Shipping Address</legend>
              <label>Address:
                <input type="text" name="address" value={formData.shippingAddress.address} onChange={handleChange} disabled={!isEditing} />
              </label>
              <label>City:
                <input type="text" name="city" value={formData.shippingAddress.city} onChange={handleChange} disabled={!isEditing} />
              </label>
              <label>Postal Code:
                <input type="text" name="postalCode" value={formData.shippingAddress.postalCode} onChange={handleChange} disabled={!isEditing} />
              </label>
              <label>Country:
                <input type="text" name="country" value={formData.shippingAddress.country} onChange={handleChange} disabled={!isEditing} />
              </label>
            </fieldset>

            {isEditing ? (
              <div className="uh-form-buttons">
                <button type="submit" className="uh-btn save">Save</button>
                <button type="button" className="uh-btn cancel" onClick={() => {
                  setFormData({
                    name: userData.name,
                    email: userData.email,
                    shippingAddress: userData.shippingAddress || {
                      address: '', city: '', postalCode: '', country: ''
                    }
                  });
                  setIsEditing(false);
                }}>Cancel</button>
              </div>
            ) : (
              <button type="button" className="uh-btn edit" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
