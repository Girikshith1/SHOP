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

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
} catch {
  // Ignore if bundled
}
dotenv.config();

let isConnecting = false;

export const connectDB = async (): Promise<void> => {
  if ((mongoose.connection.readyState as number) === 1) {
    return;
  }

  if ((mongoose.connection.readyState as number) === 2 || isConnecting) {
    let attempts = 0;
    while ((mongoose.connection.readyState as number) === 2 && attempts < 20) {
      await new Promise((r) => setTimeout(r, 100));
      attempts++;
    }
    if ((mongoose.connection.readyState as number) === 1) return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/don_streetwear';
  const maskedUri = uri.replace(/:([^@:]+)@/, ':****@');
  console.log(`[MongoDB] Attempting connection to: ${maskedUri}`);

  isConnecting = true;
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error:`, error);
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      process.exit(1);
    }
  } finally {
    isConnecting = false;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection event error:', err);
});
