import { Request, Response } from "express";
import Product from "../models/product.model";
import { uploadImage } from "../config/cloudinary";
import { FilterQuery } from "mongoose";

// GET all products with pagination, filtering, and sorting
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const categoryParam = req.query.category as string | string[];
      const search = req.query.search as string;
      const sort = req.query.sort as string;
  
      const query: FilterQuery<typeof Product> = {};
  
      // ✅ Fix: Convert comma-separated string to an array
      if (categoryParam) {
        const categoriesArray = Array.isArray(categoryParam) ? categoryParam : categoryParam.split(",");
        query.categories = { $all: categoriesArray }; // Match all categories
      }
  
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }
  
      let sortQuery: { [key: string]: 1 | -1 } = {};
      if (sort === "price-low-to-high") sortQuery.price = 1;
      else if (sort === "price-high-to-low") sortQuery.price = -1;
      else if (sort === "newest") sortQuery.createdAt = -1;
  
      const totalProducts = await Product.countDocuments(query);
      const products = await Product.find(query).sort(sortQuery).skip((page - 1) * limit).limit(limit);
  
      res.status(200).json({
        products,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
};  

// POST a new product
export const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, description, categories } = req.body;

    if (!req.files || !req.files.image || !name || !price || !description || !categories) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const imageFile = req.files.image as any;
    const base64Image = `data:${imageFile.mimetype};base64,${imageFile.data.toString("base64")}`;

    const imageUrl = await uploadImage(base64Image);
    const product = new Product({ name, price, description, categories: JSON.parse(categories), imageUrl });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await Product.distinct("categories");
      res.status(200).json({ categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
};