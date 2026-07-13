const Comment = require('../models/Comment');
const Video = require('../models/Video');

exports.getComments = async (req, res) => {
  const comments = await Comment.find({ video: req.params.videoId })
    .populate('author', 'username avatar channelName')
    .populate('replies.author', 'username avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: comments.length, data: comments });
};

exports.addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false, message: 'Comment text required' });

  const video = await Video.findById(req.params.videoId);
  if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

  const comment = await Comment.create({ text, author: req.user.id, video: req.params.videoId });
  await Video.findByIdAndUpdate(req.params.videoId, { $inc: { commentCount: 1 } });
  await comment.populate('author', 'username avatar channelName');
  res.status(201).json({ success: true, data: comment });
};

exports.updateComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
  if (comment.author.toString() !== req.user.id)
    return res.status(403).json({ success: false, message: 'Not authorized' });
  comment.text = req.body.text;
  comment.isEdited = true;
  await comment.save();
  res.json({ success: true, data: comment });
};

exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
  if (comment.author.toString() !== req.user.id)
    return res.status(403).json({ success: false, message: 'Not authorized' });
  await comment.deleteOne();
  await Video.findByIdAndUpdate(comment.video, { $inc: { commentCount: -1 } });
  res.json({ success: true, message: 'Comment deleted' });
};

exports.likeComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
  const liked = comment.likes.includes(req.user.id);
  if (liked) {
    await Comment.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user.id } });
  } else {
    await Comment.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user.id } });
  }
  res.json({ success: true, liked: !liked });
};

exports.addReply = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false, message: 'Reply text required' });
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { $push: { replies: { text, author: req.user.id } } },
    { new: true }
  ).populate('replies.author', 'username avatar');
  res.json({ success: true, data: comment });
};
