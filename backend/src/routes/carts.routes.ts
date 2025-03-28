import express from "express";
import { getCart, buyCart, addToCart, removeFromCart } from "../controllers/cart.controller";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

// GET /api/carts/:userId - Fetch user's cart
router.get("/:userId", authMiddleware, getCart);

// POST /api/carts/:userId/buy - Mark cart as sold
router.post("/:userId/buy", authMiddleware, buyCart);

router.post("/add", authMiddleware, addToCart);

router.post("/remove", authMiddleware, removeFromCart);

export default router;
