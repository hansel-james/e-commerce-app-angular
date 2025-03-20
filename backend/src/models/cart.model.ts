import mongoose, { Schema, Document, Types } from "mongoose";

interface Order extends Document {
  userId: Types.ObjectId;
  cartId: Types.ObjectId;
  shippingAddress: string;
  paymentStatus: "pending" | "paid";
  orderStatus: "pending" | "shipped" | "delivered";
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<Order>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    shippingAddress: { type: String, required: true },
    paymentStatus: { type: String, required: true, enum: ["pending", "paid"] },
    orderStatus: { type: String, required: true, enum: ["pending", "shipped", "delivered"] },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model<Order>("Order", orderSchema);

export default Order;