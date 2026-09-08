import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage.js';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, orderNumber, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: 'Name, email, and message are required' });
      return;
    }

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
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error submitting inquiry' });
  }
};
