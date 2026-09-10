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

let cachedPromise: Promise<void> | null = null;

export const connectDB = async (): Promise<void> => {
  if ((mongoose.connection.readyState as number) === 1) {
    return;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri && process.env.VERCEL) {
    console.warn('[MongoDB] MONGODB_URI environment variable is missing on Vercel deployment. Operating in server fallback store mode.');
    return;
  }

  const connectionUri = uri || 'mongodb://127.0.0.1:27017/don_streetwear';
  const maskedUri = connectionUri.replace(/:([^@:]+)@/, ':****@');
  console.log(`[MongoDB] Attempting connection to: ${maskedUri}`);

  cachedPromise = (async () => {
    try {
      const conn = await mongoose.connect(connectionUri, {
        serverSelectionTimeoutMS: 2000,
        maxPoolSize: 10,
      });
      console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
      console.error(`[MongoDB] Connection error:`, error);
      cachedPromise = null;
      if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
        process.exit(1);
      }
    }
  })();

  return cachedPromise;
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection event error:', err);
});
