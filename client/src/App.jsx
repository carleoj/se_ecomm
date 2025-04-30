import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeCard from './components/WelcomeCard';
import UserHome from './components/UserHome';
import AdminHome from './components/AdminHome';
import ProtectedRoute from './components/ProtectedRoute';

import OrdersPage from './components/OrdersPage';
import ShopPage from './components/ShopPage';
import AccountPage from './components/AccountPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeCard />} />

        <Route
          path="/user-home/*"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>

        <Route path="/admin-home" element={<AdminHome />} />
      </Routes>
    </Router>
  );
}

export default App;
