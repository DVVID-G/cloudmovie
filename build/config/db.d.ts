/**
 * Database configuration: connects to MongoDB using MONGO_URI from environment.
 */
import mongoose from 'mongoose';
/**
 * Establish a connection to MongoDB.
 * @returns {Promise<typeof mongoose>} The mongoose module (connected)
 */
export declare function connectToDatabase(): Promise<typeof mongoose>;
export default mongoose;
//# sourceMappingURL=db.d.ts.map