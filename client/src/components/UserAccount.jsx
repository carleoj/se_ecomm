import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './styles/UserHome.css';

const UserAccount = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize form data with cookie data if available
  const [formData, setFormData] = useState(() => {
    const cookieData = Cookies.get('userData');
    if (cookieData) {
      try {
        const parsedData = JSON.parse(cookieData);
        return {
          name: parsedData.name || '',
          email: parsedData.email || '',
          shippingAddress: parsedData.shippingAddress || {
            address: '',
            city: '',
            postalCode: '',
            country: ''
          }
        };
      } catch (e) {
        console.error('Error parsing cookie data:', e);
        return {
          name: '',
          email: '',
          shippingAddress: {
            address: '',
            city: '',
            postalCode: '',
            country: ''
          }
        };
      }
    }
    return {
      name: '',
      email: '',
      shippingAddress: {
        address: '',
        city: '',
        postalCode: '',
        country: ''
      }
    };
  });

  const fetchInitialUserData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No auth token found");
      }

      const res = await fetch("https://se-ecomm.onrender.com/api/users/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await res.json();
      
      // Store the data in cookies (expires in 7 days)
      const userData = {
        name: data.name || '',
        email: data.email || '',
        shippingAddress: data.shippingAddress || {
          address: '',
          city: '',
          postalCode: '',
          country: ''
        }
      };
      Cookies.set('userData', JSON.stringify(userData), { expires: 7 });
      
      // Update form data
      setFormData(userData);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setMessage("Failed to load user data. Please try logging in again.");
      setMessageType('error');
      localStorage.removeItem("authToken");
      Cookies.remove('userData');
      setTimeout(() => navigate("/", { replace: true }), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch from API if no cookie data exists
    if (!Cookies.get('userData')) {
      fetchInitialUserData();
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('shipping_')) {
      const field = name.replace('shipping_', '');
      const updatedData = {
        ...formData,
        shippingAddress: {
          ...formData.shippingAddress,
          [field]: value
        }
      };
      setFormData(updatedData);
      Cookies.set('userData', JSON.stringify(updatedData), { expires: 7 });
    } else {
      const updatedData = { ...formData, [name]: value };
      setFormData(updatedData);
      Cookies.set('userData', JSON.stringify(updatedData), { expires: 7 });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No auth token found");
      }

      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        shippingAddress: {
          address: formData.shippingAddress.address.trim(),
          city: formData.shippingAddress.city.trim(),
          postalCode: formData.shippingAddress.postalCode.trim(),
          country: formData.shippingAddress.country.trim()
        }
      };

      const res = await fetch("https://se-ecomm.onrender.com/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      const data = await res.json();
      
      // Update cookies and form data
      const userData = {
        name: data.name,
        email: data.email,
        shippingAddress: data.shippingAddress || {
          address: '',
          city: '',
          postalCode: '',
          country: ''
        }
      };
      Cookies.set('userData', JSON.stringify(userData), { expires: 7 });
      setFormData(userData);

      setIsEditing(false);
      setMessage("Profile updated successfully!");
      setMessageType('success');
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Error updating profile. Please try again.");
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Restore data from cookies
    const cookieData = Cookies.get('userData');
    if (cookieData) {
      try {
        setFormData(JSON.parse(cookieData));
      } catch (e) {
        console.error('Error parsing cookie data:', e);
      }
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="uh-container">
        <div className="uh-loading">
          <div className="uh-loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

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
          Cookies.remove('userData'); // Clear cookies on logout
          navigate("/", { replace: true });
        }} className="uh-logout-btn">Logout</button>
      </div>

      <div className="uh-dashboard">
        <h2 className="uh-dashboard-heading">Account Information</h2>
        <div className="uh-dashboard-content">
          {message && <p className={`uh-message ${messageType}`}>{message}</p>}

          <form onSubmit={handleUpdate} className="uh-account-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              {isEditing ? (
                <>
                  <label>Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </label>
                  <label>Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </label>
                </>
              ) : (
                <div className="info-display">
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{formData.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{formData.email}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="form-section">
              <h3>Shipping Address</h3>
              {isEditing ? (
                <>
                  <label>Street Address:
                    <input 
                      type="text" 
                      name="shipping_address" 
                      value={formData.shippingAddress.address} 
                      onChange={handleChange} 
                      placeholder="Enter your street address"
                    />
                  </label>
                  <label>City:
                    <input 
                      type="text" 
                      name="shipping_city" 
                      value={formData.shippingAddress.city} 
                      onChange={handleChange} 
                      placeholder="Enter your city"
                    />
                  </label>
                  <label>Postal Code:
                    <input 
                      type="text" 
                      name="shipping_postalCode" 
                      value={formData.shippingAddress.postalCode} 
                      onChange={handleChange} 
                      placeholder="Enter your postal code"
                    />
                  </label>
                  <label>Country:
                    <input 
                      type="text" 
                      name="shipping_country" 
                      value={formData.shippingAddress.country} 
                      onChange={handleChange} 
                      placeholder="Enter your country"
                    />
                  </label>
                </>
              ) : (
                <div className="info-display">
                  {formData.shippingAddress && (
                    formData.shippingAddress.address || 
                    formData.shippingAddress.city || 
                    formData.shippingAddress.postalCode || 
                    formData.shippingAddress.country
                  ) ? (
                    <>
                      <div className="info-row">
                        <span className="info-label">Street Address:</span>
                        <span className="info-value">{formData.shippingAddress.address || 'Not provided'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">City:</span>
                        <span className="info-value">{formData.shippingAddress.city || 'Not provided'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Postal Code:</span>
                        <span className="info-value">{formData.shippingAddress.postalCode || 'Not provided'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Country:</span>
                        <span className="info-value">{formData.shippingAddress.country || 'Not provided'}</span>
                      </div>
                    </>
                  ) : (
                    <p className="no-address">No shipping address provided yet. Click 'Edit Profile' to add one.</p>
                  )}
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="uh-form-buttons">
                <button type="submit" className="uh-btn save" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button 
                  type="button" 
                  className="uh-btn cancel" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                type="button" 
                className="uh-btn edit" 
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
              >
                Edit Profile
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
