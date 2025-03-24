import mongoose, { Schema, Document } from "mongoose";

// Define the Cart Item interface
interface CartItem {
  product: mongoose.Schema.Types.ObjectId; // Reference to Product
  quantity: number;
}

// Define the Cart interface
interface Cart extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Reference to User
  items: CartItem[];
  totalPrice: number;
  sold: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Cart schema
const cartSchema = new Schema<Cart>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0, min: 0 },
    sold: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

// Create the Cart model
const Cart = mongoose.model<Cart>("Cart", cartSchema);

export default Cart;
