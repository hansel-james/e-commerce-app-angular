import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { addOrder, getOrderById, getOrders } from '../controllers/order.controller';

const router = express.Router();

router.get("/", authMiddleware, getOrders);
router.post("/", authMiddleware, addOrder);
router.get("/:orderId", authMiddleware, getOrderById);

export default router;
