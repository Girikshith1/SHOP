import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/don_streetwear';
  const maskedUri = uri.replace(/:([^@:]+)@/, ':****@');
  console.log(`[MongoDB] Attempting connection to: ${maskedUri}`);

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error:`, error);
    console.warn(`[MongoDB] Please make sure your MongoDB instance is running or update MONGODB_URI in server/.env`);
    // In development, keep process alive so mock/in-memory fallback or reconnect attempts can continue
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection event error:', err);
});
