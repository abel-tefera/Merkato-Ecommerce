import express from 'express';
const router = express.Router();
import { getCart, addToCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').put(protect, addToCart).get(protect, getCart);

export default router;
