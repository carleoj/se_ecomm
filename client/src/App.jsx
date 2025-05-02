import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeCard from './components/WelcomeCard';
import UserHome from './components/UserHome';
import AdminHome from './components/AdminHome';
import ProtectedRoute from './components/ProtectedRoute';
import UserOrders from './components/UserOrders';
import UserAccount from './components/UserAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeCard />} />

        <Route
          path="/user-home/"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        />

        <Route path="/orders" element={<UserOrders />} />

        <Route path="/account" element={<UserAccount />} />

        <Route path="/admin-home" element={<AdminHome />} />
      </Routes>
    </Router>
  );
}

export default App;
