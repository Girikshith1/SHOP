import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Collection } from '../models/Collection.js';
import { User } from '../models/User.js';
import { INITIAL_PRODUCTS, INITIAL_COLLECTIONS } from './initialData.js';

import dns from 'dns';

// Fix for Windows DNS querySrv ECONNREFUSED with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if not permitted
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/don_streetwear';
  const maskedUri = uri.replace(/:([^@:]+)@/, ':****@');

  try {
    console.log(`[Seeder] Connecting to MongoDB at ${maskedUri}...`);
    await mongoose.connect(uri);
    console.log(`[Seeder] Connected successfully.`);

    // Clear existing collections & products
    console.log(`[Seeder] Clearing old products and collections...`);
    await Product.deleteMany({});
    await Collection.deleteMany({});

    // Seed collections
    console.log(`[Seeder] Seeding ${INITIAL_COLLECTIONS.length} collections...`);
    await Collection.insertMany(INITIAL_COLLECTIONS);

    // Seed products
    console.log(`[Seeder] Seeding ${INITIAL_PRODUCTS.length} products...`);
    await Product.insertMany(INITIAL_PRODUCTS);

    // Seed demo user if not exists
    const demoEmail = 'aarav.sharma@example.com';
    let user = await User.findOne({ email: demoEmail });
    if (!user) {
      console.log(`[Seeder] Creating demo user: ${demoEmail}...`);
      await User.create({
        name: 'Aarav Sharma',
        email: demoEmail,
        password: 'streetwear123',
        phone: '+91 98200 88310',
        memberTier: 'INNER CIRCLE',
        savedAddresses: [
          {
            fullName: 'Aarav Sharma',
            phone: '+91 98200 88310',
            email: 'aarav.sharma@example.com',
            addressLine1: 'Flat 402, Highline Residency',
            addressLine2: 'Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400050',
            country: 'India',
          },
        ],
      });
    }

    console.log(`[Seeder] Seed complete!`);
    console.log(`- Collections: ${await Collection.countDocuments()}`);
    console.log(`- Products: ${await Product.countDocuments()}`);
    console.log(`- Users: ${await User.countDocuments()}`);

    await mongoose.disconnect();
    console.log(`[Seeder] Disconnected from MongoDB.`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder] Seeding failed:`, error);
    process.exit(1);
  }
};

seed();
