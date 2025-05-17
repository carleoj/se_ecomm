import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './styles/UserHome.css';
import products from '../data/Products';
import Cookies from 'js-cookie';

const UserHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState("");
  const [addToCartMessage, setAddToCartMessage] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);

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
      <button className="uh-product-button" onClick={() => openModal(product)}>Add to Cart</button>
    </div>
  ));

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("name");
    setFullName(name);

    if (!token) {
      navigate("/", { replace: true });
    } else {
      setLoading(false);
    }

    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => window.history.go(1);

    // Update cart item count whenever cart items change
    const cartItems = Cookies.get('cartItems');
    if (cartItems) {
      const items = JSON.parse(cartItems);
      const count = items.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(count);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/", { replace: true });
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Update cart count after adding items
  const updateCartCount = () => {
    const cartItems = Cookies.get('cartItems');
    if (cartItems) {
      const items = JSON.parse(cartItems);
      const count = items.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(count);
    }
  };

  const handleAddToCart = () => {
    try {
      // Get existing cart items from cookies
      const existingCartItems = Cookies.get('cartItems');
      let cartItems = existingCartItems ? JSON.parse(existingCartItems) : [];

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(item => item._id === selectedProduct._id);

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if it doesn't exist
        cartItems.push({
          _id: selectedProduct._id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          image: selectedProduct.image,
          quantity: quantity,
          product: selectedProduct._id // Store the product ID for order creation
        });
      }

      // Save updated cart to cookies
      Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 });
      
      // Update cart count
      updateCartCount();
      
      // Show success message
      setAddToCartMessage('Item added to cart successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setAddToCartMessage('');
        closeModal();
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddToCartMessage('Failed to add item to cart. Please try again.');
    }
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
          <Link className="uh-navbar-btn cart-link" to="/orders">
            Cart
            {cartItemCount > 0 && <span className="cart-counter">{cartItemCount}</span>}
          </Link>
          <Link className="uh-navbar-btn" to="/account">Account</Link>
        </div>

        <button onClick={handleLogout} className="uh-logout-btn">Logout</button>
      </div>

      <div className="uh-dashboard">
        <h2 className="uh-dashboard-heading">Welcome, {fullName}!</h2>
        <div className="uh-dashboard-content">
          <p>Explore your orders, manage your account, and browse our delicious food items!</p>
        </div>

        <div className="uh-product-scroll-container">
          <button className="uh-scroll-button left" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{"<"}</button>
          <div className="uh-product-grid">
            {renderedProducts}
          </div>
          <button className="uh-scroll-button right" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{">"}</button>
        </div>
      </div>

      {/* Enhanced Modal for adding to cart */}
      {isModalOpen && selectedProduct && (
        <div className="uh-modal-overlay" onClick={closeModal}>
          <div className="uh-modal" onClick={e => e.stopPropagation()}>
            <div className="uh-modal-header">
              <h3 className="uh-modal-title">Add to Cart</h3>
              <button className="uh-modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <div className="uh-modal-content">
              {addToCartMessage && (
                <div className="uh-modal-message success">
                  {addToCartMessage}
                </div>
              )}
              <div className="uh-modal-product-info">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="uh-modal-product-image"
                />
                <div className="uh-modal-product-details">
                  <h4 className="uh-modal-product-name">{selectedProduct.name}</h4>
                  <p className="uh-modal-product-price">${selectedProduct.price}</p>
                  <p>{selectedProduct.description}</p>
                </div>
              </div>

              <div className="uh-modal-quantity">
                <label htmlFor="quantity">Quantity:</label>
                <div className="uh-quantity-controls">
                  <button 
                    type="button" 
                    className="uh-quantity-btn"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    className="uh-quantity-input"
                    value={quantity}
                    min="1"
                    onChange={handleQuantityChange}
                  />
                  <button 
                    type="button" 
                    className="uh-quantity-btn"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="uh-modal-total">
                Total: ${(selectedProduct.price * quantity).toFixed(2)}
              </div>

              <div className="uh-modal-buttons">
                <button 
                  className="uh-modal-btn cancel" 
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  className="uh-modal-btn add" 
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHome;
