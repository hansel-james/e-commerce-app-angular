import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Order document
interface Order extends Document {
  userId: mongoose.Schema.Types.ObjectId; // User ID who placed the order
  cartId: mongoose.Schema.Types.ObjectId; // Cart ID from which the order was made
  shippingAddress: string; // Shipping address for the order
  paymentStatus: string; // Payment status (e.g., 'pending', 'paid')
  orderStatus: string; // Order status (e.g., 'pending', 'shipped', 'delivered')
  totalPrice: number; // Total price of the order
  createdAt: Date;
  updatedAt: Date;
}

// Define the Order schema
const orderSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
    shippingAddress: { type: String, required: true },
    paymentStatus: { type: String, required: true, enum: ["pending", "paid"] },
    orderStatus: { type: String, required: true, enum: ["pending", "shipped", "delivered"] },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

// Create the Order model
const Order = mongoose.model<Order>("Order", orderSchema);

export default Order;