import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    pexelsVideoId: { type: Number, index: true },
    duration: { type: Number, default: 0 }, // seconds
    thumbnails: [{ type: String }],
    videoFiles: [
      {
        link: { type: String, required: true },
        quality: { type: String }, // e.g., 'hd', 'sd'
        width: { type: Number },
        height: { type: Number },
        file_type: { type: String },
      },
    ],
    tags: [{ type: String, index: true }],
    source: { type: String, enum: ['pexels', 'local'], default: 'pexels' },
  },
  { timestamps: true }
);

MovieSchema.index({ title: 'text', description: 'text', tags: 1 });

const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);
module.exports = Movie;
