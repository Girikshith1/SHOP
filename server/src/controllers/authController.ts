import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'don_streetwear_super_secret_jwt_key_2026_change_in_production';
  return jwt.sign({ id }, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password || 'temp_password_123',
      phone,
      memberTier: 'INNER CIRCLE',
      savedAddresses: [],
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      user: user.toJSON(),
      token,
      message: 'Account created successfully',
    });
  } catch (error: any) {
    console.error('Error in register:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      // Auto-provision if user doesn't exist yet (mock to live friendly)
      const newUser = await User.create({
        name: email.split('@')[0],
        email: email.toLowerCase(),
        password: password || 'default_password',
        memberTier: 'INNER CIRCLE',
        savedAddresses: [],
      });
      const token = generateToken(newUser._id.toString());
      res.status(200).json({
        user: newUser.toJSON(),
        token,
        message: 'Logged in successfully',
      });
      return;
    }

    if (password && user.password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
    }

    const token = generateToken(user._id.toString());
    res.status(200).json({
      user: user.toJSON(),
      token,
      message: 'Logged in successfully',
    });
  } catch (error: any) {
    console.error('Error in login:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    res.status(200).json({ user: req.user.toJSON() });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { name, phone, memberTier } = req.body;
    if (name) req.user.name = name;
    if (phone !== undefined) req.user.phone = phone;
    if (memberTier) req.user.memberTier = memberTier;

    await req.user.save();
    res.status(200).json({ user: req.user.toJSON(), message: 'Profile updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const addOrUpdateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const address = req.body;
    if (!address || !address.fullName || !address.addressLine1 || !address.city || !address.pincode) {
      res.status(400).json({ message: 'Incomplete address information' });
      return;
    }

    // Replace existing if matching addressLine1 and pincode, or prepend
    const existingIndex = req.user.savedAddresses.findIndex(
      (a) => a.addressLine1 === address.addressLine1 && a.pincode === address.pincode
    );

    if (existingIndex >= 0) {
      req.user.savedAddresses[existingIndex] = address;
    } else {
      req.user.savedAddresses.unshift(address);
    }

    await req.user.save();
    res.status(200).json({ user: req.user.toJSON(), message: 'Address saved successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
