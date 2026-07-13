const User = require('../models/User');
const Video = require('../models/Video');

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

exports.updateUser = async (req, res) => {
  const { channelName, channelDescription, username } = req.body;
  const update = {};
  if (channelName) update.channelName = channelName;
  if (channelDescription) update.channelDescription = channelDescription;
  if (username) update.username = username;
  if (req.file) update.avatar = `/uploads/thumbnails/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true, runValidators: true });
  res.json({ success: true, data: user });
};

exports.subscribeToChannel = async (req, res) => {
  if (req.user.id === req.params.id)
    return res.status(400).json({ success: false, message: 'Cannot subscribe to yourself' });

  const channel = await User.findById(req.params.id);
  if (!channel) return res.status(404).json({ success: false, message: 'Channel not found' });

  const alreadySubscribed = channel.subscribers.includes(req.user.id);
  if (alreadySubscribed) {
    await User.findByIdAndUpdate(req.params.id, { $pull: { subscribers: req.user.id } });
    await User.findByIdAndUpdate(req.user.id, { $pull: { subscribedChannels: req.params.id } });
    return res.json({ success: true, subscribed: false, message: 'Unsubscribed' });
  } else {
    await User.findByIdAndUpdate(req.params.id, { $addToSet: { subscribers: req.user.id } });
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { subscribedChannels: req.params.id } });
    return res.json({ success: true, subscribed: true, message: 'Subscribed' });
  }
};

exports.getChannelVideos = async (req, res) => {
  const videos = await Video.find({ uploader: req.params.id, isPublic: true })
    .populate('uploader', 'username avatar channelName')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: videos.length, data: videos });
};

exports.getSubscriptionFeed = async (req, res) => {
  const user = await User.findById(req.user.id);
  const videos = await Video.find({ uploader: { $in: user.subscribedChannels }, isPublic: true })
    .populate('uploader', 'username avatar channelName subscribers')
    .sort({ createdAt: -1 })
    .limit(20);
  res.json({ success: true, data: videos });
};
