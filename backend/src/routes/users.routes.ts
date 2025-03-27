import express from 'express';
import { signup, login, logout, getUser } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/:id', authMiddleware, getUser);

export default router; // ✅ Ensure default export
