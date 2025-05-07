// src/components/OrderTable.jsx
import React from 'react';
import './styles/OrderTable.css';

const OrderTable = ({ orders }) => {
  return (
    <div className="uo-table-wrapper">
      <table className="uo-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Item</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={idx}>
              <td>{order.id}</td>
              <td>{order.item}</td>
              <td>{order.date}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
