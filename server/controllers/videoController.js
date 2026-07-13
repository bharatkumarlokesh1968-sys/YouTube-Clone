const Video = require('../models/Video');
const User = require('../models/User');

exports.getVideos = async (req, res) => {
  const { category, limit = 20, page = 1 } = req.query;
  const query = { isPublic: true };
  if (category && category !== 'All') query.category = category;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const videos = await Video.find(query)
    .populate('uploader', 'username avatar channelName subscribers isVerified')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  const total = await Video.countDocuments(query);
  res.json({ success: true, count: videos.length, total, data: videos });
};

exports.getVideo = async (req, res) => {
  const video = await Video.findById(req.params.id).populate(
    'uploader',
    'username avatar channelName subscribers isVerified channelDescription'
  );
  if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
  // Increment views
  await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  res.json({ success: true, data: video });
};

exports.uploadVideo = async (req, res) => {
  const { title, description, category, tags, duration } = req.body;
  if (!req.files?.video) return res.status(400).json({ success: false, message: 'Video file required' });

  const videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
  const thumbnailUrl = req.files?.thumbnail
    ? `/uploads/thumbnails/${req.files.thumbnail[0].filename}`
    : `https://picsum.photos/seed/${Date.now()}/1280/720`;

  const video = await Video.create({
    title,
    description,
    videoUrl,
    thumbnailUrl,
    uploader: req.user.id,
    category: category || 'Other',
    tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    duration: duration || '0:00',
  });

  await video.populate('uploader', 'username avatar channelName');
  res.status(201).json({ success: true, data: video });
};

exports.updateVideo = async (req, res) => {
  let video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
  if (video.uploader.toString() !== req.user.id)
    return res.status(403).json({ success: false, message: 'Not authorized' });

  const { title, description, category, tags, isPublic } = req.body;
  const update = {};
  if (title) update.title = title;
  if (description !== undefined) update.description = description;
  if (category) update.category = category;
  if (tags) update.tags = tags.split(',').map((t) => t.trim());
  if (isPublic !== undefined) update.isPublic = isPublic;
  if (req.file) update.thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;

  video = await Video.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json({ success: true, data: video });
};

exports.deleteVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
  if (video.uploader.toString() !== req.user.id)
    return res.status(403).json({ success: false, message: 'Not authorized' });
  await video.deleteOne();
  res.json({ success: true, message: 'Video deleted' });
};

exports.likeVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

  const liked = video.likes.includes(req.user.id);
  const disliked = video.dislikes.includes(req.user.id);

  if (liked) {
    await Video.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user.id } });
    return res.json({ success: true, liked: false });
  }
  const update = { $addToSet: { likes: req.user.id } };
  if (disliked) update.$pull = { dislikes: req.user.id };
  await Video.findByIdAndUpdate(req.params.id, update);
  res.json({ success: true, liked: true });
};

exports.dislikeVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

  const disliked = video.dislikes.includes(req.user.id);
  const liked = video.likes.includes(req.user.id);

  if (disliked) {
    await Video.findByIdAndUpdate(req.params.id, { $pull: { dislikes: req.user.id } });
    return res.json({ success: true, disliked: false });
  }
  const update = { $addToSet: { dislikes: req.user.id } };
  if (liked) update.$pull = { likes: req.user.id };
  await Video.findByIdAndUpdate(req.params.id, update);
  res.json({ success: true, disliked: true });
};

exports.getTrendingVideos = async (req, res) => {
  const videos = await Video.find({ isPublic: true })
    .populate('uploader', 'username avatar channelName isVerified')
    .sort({ views: -1, createdAt: -1 })
    .limit(20);
  res.json({ success: true, data: videos });
};

exports.getRelatedVideos = async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
  const related = await Video.find({
    _id: { $ne: video._id },
    isPublic: true,
    $or: [{ category: video.category }, { tags: { $in: video.tags } }],
  })
    .populate('uploader', 'username avatar channelName isVerified')
    .limit(10);
  res.json({ success: true, data: related });
};
