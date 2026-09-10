import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ContactMessage } from '../models/ContactMessage.js';
import { fallbackStore } from '../utils/fallbackStore.js';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  const { name, email, subject, orderNumber, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ message: 'Name, email, and message are required' });
    return;
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const contact = await ContactMessage.create({
        name,
        email,
        subject: subject || 'General Inquiry',
        orderNumber,
        message,
      });

      res.status(201).json({
        message: 'Thank you for reaching out. Our team will contact you shortly.',
        id: contact._id.toString(),
      });
      return;
    } catch (err) {
      console.warn('[DB] Failed to save contact message to MongoDB:', err);
    }
  }

  const createdInq = fallbackStore.addInquiry({ name, email, subject, orderNumber, message });
  res.status(201).json({
    message: 'Thank you for reaching out. Our team will contact you shortly.',
    id: createdInq.id,
  });
};
