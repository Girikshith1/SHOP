import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  addOrUpdateAddress,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/address', protect, addOrUpdateAddress);

export default router;
