const Video = require('../models/Video');
const User = require('../models/User');

exports.search = async (req, res) => {
  const { q, type = 'video', sort = 'relevance' } = req.query;
  if (!q) return res.status(400).json({ success: false, message: 'Search query required' });

  const regex = new RegExp(q, 'i');
  let sortOption = { createdAt: -1 };
  if (sort === 'views') sortOption = { views: -1 };
  if (sort === 'likes') sortOption = { likes: -1 };

  if (type === 'channel') {
    const users = await User.find({
      $or: [{ username: regex }, { channelName: regex }],
    }).limit(10);
    return res.json({ success: true, data: users });
  }

  const videos = await Video.find({
    isPublic: true,
    $or: [{ title: regex }, { description: regex }, { tags: regex }],
  })
    .populate('uploader', 'username avatar channelName isVerified')
    .sort(sortOption)
    .limit(20);

  res.json({ success: true, count: videos.length, data: videos });
};
