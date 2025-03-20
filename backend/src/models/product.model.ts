import mongoose, { Schema, Document } from "mongoose";

// Define the Product interface
interface Product extends Document {
  name: string;
  price: number;
  description: string;
  categories: string[];
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Product schema
const productSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    categories: { type: [String], required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

// Create the Product model
const Product = mongoose.model<Product>("Product", productSchema);

export default Product;