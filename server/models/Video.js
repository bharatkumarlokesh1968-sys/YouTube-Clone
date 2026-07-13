const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, default: '', maxlength: 5000 },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String, trim: true }],
    category: {
      type: String,
      enum: ['Gaming', 'Music', 'Tech', 'Vlog', 'Education', 'Sports', 'Comedy', 'News', 'Other'],
      default: 'Other',
    },
    duration: { type: String, default: '0:00' },
    isPublic: { type: Boolean, default: true },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Video', videoSchema);
