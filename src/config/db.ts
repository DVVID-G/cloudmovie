/**
 * Database configuration: connects to MongoDB using MONGO_URI from environment.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in environment variables');
}

/**
 * Establish a connection to MongoDB.
 * @returns {Promise<typeof mongoose>} The mongoose module (connected)
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  try {
    const conn = await mongoose.connect(MONGO_URI as string);
    console.info('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default mongoose;

