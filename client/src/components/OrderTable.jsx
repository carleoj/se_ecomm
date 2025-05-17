import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/OrderTable.css';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get("https://se-ecomm.onrender.com/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.data) {
          throw new Error("No data received from server");
        }
        
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch orders");
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="uo-table-wrapper">
      <table className="uo-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Items</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-orders">No orders found</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.orderItems.map((item, idx) => (
                    <div key={idx}>{item.name} (x{item.qty})</div>
                  ))}
                </td>
                <td>{order.paymentMethod}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{order.isPaid ? 'Paid' : 'Unpaid'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
