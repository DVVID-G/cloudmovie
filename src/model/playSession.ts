import mongoose from 'mongoose';

const PlaySessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
    status: { type: String, enum: ['playing', 'paused', 'stopped'], default: 'stopped' },
    positionSec: { type: Number, default: 0 },
    startedAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

PlaySessionSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const PlaySession =
  mongoose.models.PlaySession || mongoose.model('PlaySession', PlaySessionSchema);
module.exports = PlaySession;
