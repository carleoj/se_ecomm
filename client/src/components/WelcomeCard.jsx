import React, { useState } from 'react';
import axios from 'axios';
import './styles/WelcomeCard.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const WelcomeCard = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://se-ecomm.onrender.com/api/users/login', { email, password });
      console.log('Login successful:', response.data);
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('authToken', response.data.token);

      if (response.data.isAdmin) {
        navigate('/admin-home');
      } else {
        navigate('/user-home');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message);
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true); // Show the loading modal when the signup request starts

    try {
      const res = await axios.post('https://se-ecomm.onrender.com/api/users', {
        name: fullName,
        email,
        password,
      });

      console.log('User created:', res.data);
      setModalMessage('Account created successfully! You can now log in.');
      setShowModal(true);
    } catch (error) {
      console.error('Signup error:', error.response?.data?.message || error.message);
      setModalMessage(error.response?.data?.message || 'Something went wrong, please try again.');
      setShowModal(true);
    } finally {
      setIsLoading(false); // Hide the loading modal once the request is complete
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="card-container">
      <div className="card">
        <div className="card-overlay"></div>
        <div className="card-inner">
          <h2>{isSignUp ? "Create a new Account" : "Login to Foodini"}</h2>
          <form className="auth-form" onSubmit={isSignUp ? handleSignup : (e) => e.preventDefault()}>
            {isSignUp ? (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Username or Email"
                  required
                  value={email} // Controlled input
                  onChange={(e) => setEmail(e.target.value)} // Controlled input handler
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password} // Controlled input
                  onChange={(e) => setPassword(e.target.value)} // Controlled input handler
                />
                <button type="button" onClick={handleLogin}>Login</button>
              </>
            )}
          </form>
          <button
            type="button"
            className={`toggle-btn ${isSignUp ? 'login' : 'signup'}`}
            onClick={toggleForm}
          >
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </button>

          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p className="loading-text">Creating your account...</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for account creation success or failure */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button className="modal-close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeCard;
