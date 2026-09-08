import { Router } from 'express';
import {
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  clearAllOrders,
  getInquiries,
  updateInquiryStatus,
} from '../controllers/adminController.js';

const router = Router();

router.get('/stats', getAdminStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders', clearAllOrders);
router.delete('/orders/:id', deleteOrder);
router.get('/inquiries', getInquiries);
router.put('/inquiries/:id/status', updateInquiryStatus);

export default router;
