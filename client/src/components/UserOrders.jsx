import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import OrderTable from './OrderTable';
import Cookies from 'js-cookie';
import './styles/UserOrders.css';

const UserOrders = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = Cookies.get('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    // Save cart items to cookies whenever they change
    Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 });
  }, [cartItems]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setOrderMessage('Your cart is empty!');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error('Please log in again to place your order.');
      }

      const userData = JSON.parse(Cookies.get('userData'));
      const shippingAddress = userData?.shippingAddress;

      if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
        setOrderMessage('Please complete your shipping address in your account settings first!');
        setMessageType('error');
        setIsLoading(false);
        return;
      }

      const subtotal = calculateTotal();
      const shippingCost = 10.00;
      const tax = subtotal * 0.12;
      const totalAmount = subtotal + shippingCost + tax;

      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: Number(item.price)
        })),
        shippingAddress: {
          address: shippingAddress.address.trim(),
          city: shippingAddress.city.trim(),
          postalCode: shippingAddress.postalCode.trim(),
          country: shippingAddress.country.trim()
        },
        totalAmount: Number(totalAmount.toFixed(2))
      };

      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      // First check if the server is accessible
      try {
        const healthCheck = await fetch('https://se-ecomm.onrender.com/api/health');
        if (!healthCheck.ok) {
          throw new Error('Server is currently unavailable. Please try again later.');
        }
      } catch (error) {
        console.error('Server health check failed:', error);
        throw new Error('Cannot connect to server. Please check your internet connection and try again.');
      }

      const response = await fetch('https://se-ecomm.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw server response:', responseText);

      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (error) {
        console.error('Failed to parse server response as JSON:', error);
        console.error('Raw response:', responseText);
        throw new Error('Server returned an invalid response. Please try again later.');
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to place order');
      }

      if (!responseData.success) {
        throw new Error(responseData.message || 'Failed to place order');
      }

      // Clear cart after successful order
      setCartItems([]);
      Cookies.set('cartItems', '[]');
      
      setOrderMessage('Order placed successfully! Your order ID is: ' + responseData.order._id);
      setMessageType('success');
      setIsOrderModalOpen(false);

      // Refresh the orders table after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error placing order:', error);
      setOrderMessage(error.message || 'Failed to place order. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

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
        
        {/* Cart Section */}
        <div className="cart-section">
          <h3>Shopping Cart ({cartItems.length} items)</h3>
          {cartItems.length > 0 ? (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item._id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p>${item.price}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="quantity-btn"
                      >-</button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="quantity-btn"
                      >+</button>
                    </div>
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="remove-btn"
                    >×</button>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <div className="cart-total">
                  <span>Subtotal:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="cart-total">
                  <span>Shipping:</span>
                  <span>$10.00</span>
                </div>
                <div className="cart-total">
                  <span>Tax (12%):</span>
                  <span>${(calculateTotal() * 0.12).toFixed(2)}</span>
                </div>
                <div className="cart-total grand-total">
                  <span>Total:</span>
                  <span>${(calculateTotal() + 10.00 + (calculateTotal() * 0.12)).toFixed(2)}</span>
                </div>
                <button 
                  className="place-order-btn"
                  onClick={() => setIsOrderModalOpen(true)}
                  disabled={cartItems.length === 0}
                >
                  Place Order
                </button>
              </div>
            </>
          ) : (
            <p className="empty-cart-message">Your cart is empty. Start shopping!</p>
          )}
        </div>

        {/* Order History */}
        <div className="order-history-section">
          <h3>Order History</h3>
          <OrderTable />
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {isOrderModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Order</h3>
            {orderMessage ? (
              <>
                <p className={`order-message ${messageType}`}>{orderMessage}</p>
                <div className="modal-buttons">
                  <button 
                    className="cancel-btn"
                    onClick={() => {
                      setIsOrderModalOpen(false);
                      setOrderMessage('');
                      if (messageType === 'success') {
                        window.location.reload();
                      }
                    }}
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>Are you sure you want to place this order?</p>
                <div className="order-summary-modal">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>$10.00</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (12%):</span>
                    <span>${(calculateTotal() * 0.12).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${(calculateTotal() + 10.00 + (calculateTotal() * 0.12)).toFixed(2)}</span>
                  </div>
                </div>
                <div className="modal-buttons">
                  <button 
                    className="confirm-btn"
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Confirm Order'}
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => {
                      setIsOrderModalOpen(false);
                      setOrderMessage('');
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
