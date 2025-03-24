import express from "express";
import { getCart, buyCart, addToCart, removeFromCart } from "../controllers/cart.controller";

const router = express.Router();

// GET /api/carts/:userId - Fetch user's cart
router.get("/:userId", getCart);

// POST /api/carts/:userId/buy - Mark cart as sold
router.post("/:userId/buy", buyCart);

router.post("/add", addToCart);

router.post("/remove", removeFromCart);

export default router;
