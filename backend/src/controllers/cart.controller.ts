import { Request, Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import mongoose from "mongoose";

// Get cart details
export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        console.log('trying to get for : ', userId);

        const cart = await Cart.findOne({ userId, sold: false })
            .populate({
                path: "items.product",
                model: Product,
                select: "_id name price imageUrl description categories"
            });

        if (!cart) {
            res.status(200).json({ userId, items: [], totalPrice: 0 });
            return;
        }

        console.log('cart is : ', cart);

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Buy cart (mark as sold)
export const buyCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOneAndUpdate(
            { userId, sold: false },
            { sold: true },
            { new: true }
        );

        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, cartItems, totalPrice } = req.body;

        let cart = await Cart.findOne({ userId, sold: false });

        if (!cart) {
            cart = new Cart({
                userId,
                items: cartItems.filter((item: { quantity: number }) => item.quantity > 0), // Only add valid items
                totalPrice: Math.max(0, totalPrice), // Ensure total price is non-negative
            });
        } else {
            const updatedItemsMap = new Map<string, { product: mongoose.Schema.Types.ObjectId; quantity: number }>();

            // Add existing items to the map (convert ObjectId to string)
            cart.items.forEach((item) => {
                updatedItemsMap.set(item.product.toString(), { 
                    product: item.product, 
                    quantity: item.quantity 
                });
            });

            // Merge new items
            cartItems.forEach((newItem: { product: string; quantity: number }) => {
                const productId = new mongoose.Schema.Types.ObjectId(newItem.product);
                const newQuantity = Number(newItem.quantity) || 0;

                if (updatedItemsMap.has(productId.toString())) {
                    const existingItem = updatedItemsMap.get(productId.toString())!;
                    existingItem.quantity += newQuantity;
                } else if (newQuantity > 0) {
                    updatedItemsMap.set(productId.toString(), { product: productId, quantity: newQuantity });
                }
            });

            // Remove items with non-positive quantities
            cart.items = Array.from(updatedItemsMap.values()).filter(item => item.quantity > 0);

            // Ensure total price doesn't go negative
            cart.totalPrice = Math.max(0, cart.totalPrice + totalPrice);
        }

        await cart.save();

        // Fetch updated cart
        const updatedCart = await Cart.findOne({ userId, sold: false }).populate({
            path: "items.product",
            model: Product,
            select: "_id name price imageUrl description categories",
        });

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, productId } = req.body;

        let cart = await Cart.findOne({ userId, sold: false });

        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        // Remove the specified product
        const updatedItems = cart.items.filter(item => item.product.toString() !== productId);

        // If the item wasn't in the cart
        if (updatedItems.length === cart.items.length) {
            res.status(404).json({ message: "Item not found in cart" });
            return;
        }

        cart.items = updatedItems;

        // Recalculate total price
        const product = await Product.findById(productId);
        if (product) {
            cart.totalPrice = cart.items.reduce(
                (total, item) => total + item.quantity * product.price,
                0
            );
        }
        cart.totalPrice = Math.max(0, cart.totalPrice); // Ensure non-negative total

        // If the cart is empty, delete it
        if (cart.items.length === 0) {
            await Cart.deleteOne({ userId });
            res.status(200).json([]);
            return;
        }

        // Save updated cart
        await cart.save();

        // Fetch updated cart
        const updatedCart = await Cart.findOne({ userId, sold: false }).populate({
            path: "items.product",
            model: Product,
            select: "_id name price imageUrl description categories",
        });

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};