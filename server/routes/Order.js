const express = require("express");
const orderRoute = express.Router();
const protect = require("../middleware/Auth");
const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const mongoose = require('mongoose');
const Product = require("../models/Product");

// Create new order
orderRoute.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    try {
      console.log('Starting order creation with body:', JSON.stringify(req.body, null, 2));
      console.log('User ID:', req.user._id);

      const { orderItems, shippingAddress, totalAmount } = req.body;

      // Validate order items
      if (!Array.isArray(orderItems)) {
        console.log('Invalid orderItems format:', orderItems);
        return res.status(400).json({
          success: false,
          message: "Order items must be an array"
        });
      }

      if (orderItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No order items found"
        });
      }

      // Validate shipping address
      if (!shippingAddress || 
          typeof shippingAddress !== 'object' ||
          !shippingAddress.address ||
          !shippingAddress.city ||
          !shippingAddress.postalCode ||
          !shippingAddress.country) {
        console.log('Invalid shipping address:', shippingAddress);
        return res.status(400).json({
          success: false,
          message: "Invalid shipping address format"
        });
      }

      // Validate total amount
      if (!totalAmount || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
        console.log('Invalid total amount:', totalAmount);
        return res.status(400).json({
          success: false,
          message: "Invalid total amount"
        });
      }

      // Validate order items structure
      const validatedItems = orderItems.map((item, index) => {
        if (!item.name || !item.qty || !item.image || !item.price) {
          throw new Error(`Invalid order item at index ${index}: ${JSON.stringify(item)}`);
        }
        return {
          name: item.name,
          qty: Number(item.qty),
          image: item.image,
          price: Number(item.price)
        };
      });

      // Create order with validated data
      const orderData = {
        user: req.user._id,
        orderItems: validatedItems,
        shippingAddress: {
          address: shippingAddress.address.trim(),
          city: shippingAddress.city.trim(),
          postalCode: shippingAddress.postalCode.trim(),
          country: shippingAddress.country.trim()
        },
        totalAmount: Number(totalAmount),
        paymentMethod: "COD" // Explicitly set payment method
      };

      console.log('Creating order with data:', JSON.stringify(orderData, null, 2));

      const order = new Order(orderData);

      // Force set payment method again
      order.paymentMethod = "COD";

      // Log the order instance before saving
      console.log('Order instance before save:', order.toObject());

      const createdOrder = await order.save();
      
      // Force set payment method one more time after save
      createdOrder.paymentMethod = "COD";
      await createdOrder.save();
      
      // Log the created order
      console.log('Order created successfully:', JSON.stringify(createdOrder.toObject(), null, 2));

      // Verify payment method after creation
      const verifiedOrder = await Order.findById(createdOrder._id);
      console.log('Verified order payment method:', verifiedOrder.paymentMethod);

      // Force COD in the response
      const responseOrder = createdOrder.toObject();
      responseOrder.paymentMethod = "COD";

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: {
          _id: responseOrder._id,
          orderItems: responseOrder.orderItems,
          shippingAddress: responseOrder.shippingAddress,
          totalAmount: responseOrder.totalAmount,
          paymentMethod: "COD",
          isPaid: responseOrder.isPaid,
          createdAt: responseOrder.createdAt
        }
      });

    } catch (error) {
      console.error('Order creation error:', error);
      console.error('Error stack:', error.stack);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: Object.values(error.errors).map(err => err.message)
        });
      }

      // Handle MongoDB errors
      if (error.name === 'MongoError' || error.name === 'MongoServerError') {
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: error.message
        });
      }

      // Handle other errors
      return res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message
      });
    }
  })
);

// Get all orders for a user
orderRoute.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    try {
      console.log('Fetching orders for user:', req.user._id);
      
      // First try to update all orders for this user to COD
      await Order.updateMany(
        { user: req.user._id },
        { $set: { paymentMethod: "COD" } },
        { new: true }
      );

      // Then fetch the orders
      const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 });

      // Log each order's payment method
      orders.forEach(order => {
        console.log('Order ID:', order._id, 'Payment Method:', order.paymentMethod);
      });

      // Force set COD in the response
      const modifiedOrders = orders.map(order => {
        const orderObj = order.toObject();
        orderObj.paymentMethod = "COD";
        return orderObj;
      });

      res.json(modifiedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message
      });
    }
  })
);

// Get specific order by ID
orderRoute.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate("user", "email");
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch order",
        error: error.message
      });
    }
  })
);

// Update order to paid
orderRoute.put(
  '/:id/payment',
  protect,
  asyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        const updatedOrder = await order.save();
        res.json({
          success: true,
          message: "Order payment updated successfully",
          order: updatedOrder
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }
    } catch (error) {
      console.error('Error updating order payment:', error);
      res.status(500).json({
        success: false,
        message: "Failed to update order payment",
        error: error.message
      });
    }
  })
);

module.exports = orderRoute;