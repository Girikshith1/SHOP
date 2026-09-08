import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderByIdOrNumber,
} from '../controllers/orderController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:identifier', optionalAuth, getOrderByIdOrNumber);

export default router;
