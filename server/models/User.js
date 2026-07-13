const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: '' },
    channelName: { type: String, default: '' },
    channelDescription: { type: String, default: '' },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subscribedChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    totalViews: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    bannerImage: { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual('subscriberCount').get(function () {
  return this.subscribers.length;
});

module.exports = mongoose.model('User', userSchema);
