import { Request, Response } from "express";
import Order from "../models/order.model";
import Cart from "../models/cart.model";

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.user;
        const orders = await Order.find({ userId: id })
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.error("Error in fetching orders: ", error);
    }
};

export const addOrder = async(req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.user;
        const { shippingAddress, paymentStatus, orderStatus, totalPrice } = req.body;
        // find the cart which is not sold yet
        const cart = await Cart.findOne({ userId: id, sold: false });
        if(!cart) {
            res.status(404).json({ error: "Cart not found." });
        } else {
            // create a new Order
            const order = new Order({
                userId: id,
                cartId: cart._id,
                shippingAddress,
                paymentStatus,
                orderStatus,
                totalPrice
            });
            await order.save();
            const upCart = await Cart.findOneAndUpdate({ userId: id, sold: false }, { sold: true });
            await upCart.save();
            res.status(201).json(order);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.error('error in adding order : ', error);
    }
}

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;
        const { id } = req.user;

        const order = await Order.findOne({ _id: orderId, userId: id });

        if (!order) {
            res.status(404).json({ error: "Order with ID not found!" });
        } else {
            res.status(200).json(order);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error!" });
        console.error("Error in getting order by ID: ", error);
    }
};