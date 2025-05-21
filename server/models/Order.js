const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true }
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "COD",
      set: function(v) {
        // Always set to COD regardless of input
        return "COD";
      }
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Add pre-save middleware to ensure paymentMethod is set
orderSchema.pre('save', function(next) {
  if (!this.paymentMethod) {
    this.paymentMethod = "COD";
  }
  next();
});

// Add post-save middleware to verify saved data
orderSchema.post('save', function(doc) {
  console.log('Order saved with payment method:', doc.paymentMethod);
});

// Static method to update all existing orders
orderSchema.statics.updateAllPaymentMethods = async function() {
  try {
    const result = await this.updateMany(
      {}, // Match all documents
      { $set: { paymentMethod: "COD" } }
    );
    console.log('Updated payment methods:', result);
    return result;
  } catch (error) {
    console.error('Error updating payment methods:', error);
    throw error;
  }
};

module.exports = mongoose.model("Order", orderSchema);