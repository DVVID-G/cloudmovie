"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
/**
 * Database configuration: connects to MongoDB using MONGO_URI from environment.
 */
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
}
/**
 * Establish a connection to MongoDB.
 * @returns {Promise<typeof mongoose>} The mongoose module (connected)
 */
async function connectToDatabase() {
    try {
        const conn = await mongoose_1.default.connect(MONGO_URI);
        console.info('MongoDB connected successfully');
        return conn;
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}
exports.default = mongoose_1.default;
//# sourceMappingURL=db.js.map