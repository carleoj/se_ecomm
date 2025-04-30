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

  const navigate = useNavigate(); 

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://se-ecomm.onrender.com/api/users/login', { email, password });
      console.log('Login successful:', response.data);

      // Store the token (you can use localStorage or cookies for storing the token)
      localStorage.setItem('authToken', response.data.token);
      
      if (response.data.isAdmin) {
        navigate('/admin-home');
      } else {
        navigate('/user-home');
      }
      
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('https://se-ecomm.onrender.com/api/users', {
        name: fullName,
        email,
        password,
      });

      console.log('User created:', res.data);
      alert('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Something went wrong');
    }
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
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
