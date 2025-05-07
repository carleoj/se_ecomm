import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/OrderTable.css';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("https://se-ecomm.onrender.com/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

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
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>
                {order.orderItems.map((item, idx) => (
                  <div key={idx}>{item.name} (x{item.qty})</div>
                ))}
              </td>
              <td>{order.paymentMethods}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>{order.isPaid ? 'Paid' : 'Unpaid'}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
