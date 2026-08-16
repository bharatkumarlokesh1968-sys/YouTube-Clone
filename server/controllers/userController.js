const User = require('../models/User');
const Video = require('../models/Video');

// Get user / channel
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
};


// Update user
exports.updateUser = async (req, res) => {
  try {
    const { channelName, channelDescription, username } = req.body;

    const update = {};

    if (channelName) {
      update.channelName = channelName;
    }

    if (channelDescription) {
      update.channelDescription = channelDescription;
    }

    if (username) {
      update.username = username;
    }

    if (req.file) {
      update.avatar = `/uploads/thumbnails/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      update,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Update user error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};


// Subscribe / Unsubscribe
exports.subscribeToChannel = async (req, res) => {
  try {

    const currentUserId = req.user.id;
    const channelId = req.params.id;

    // Cannot subscribe to yourself
    if (currentUserId.toString() === channelId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot subscribe to yourself'
      });
    }

    // Find channel
    const channel = await User.findById(channelId);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found'
      });
    }

    // Check if already subscribed
    const alreadySubscribed = channel.subscribers.some(
      id => id.toString() === currentUserId.toString()
    );

    // If already subscribed → unsubscribe
    if (alreadySubscribed) {

      await User.findByIdAndUpdate(
        channelId,
        {
          $pull: {
            subscribers: currentUserId
          }
        }
      );

      await User.findByIdAndUpdate(
        currentUserId,
        {
          $pull: {
            subscribedChannels: channelId
          }
        }
      );

      return res.json({
        success: true,
        subscribed: false,
        message: 'Unsubscribed successfully'
      });
    }

    // If not subscribed → subscribe
    await User.findByIdAndUpdate(
      channelId,
      {
        $addToSet: {
          subscribers: currentUserId
        }
      }
    );

    await User.findByIdAndUpdate(
      currentUserId,
      {
        $addToSet: {
          subscribedChannels: channelId
        }
      }
    );

    res.json({
      success: true,
      subscribed: true,
      message: 'Subscribed successfully'
    });

  } catch (error) {
    console.error('Subscribe error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to subscribe'
    });
  }
};


// Get channel videos
exports.getChannelVideos = async (req, res) => {
  try {

    const videos = await Video.find({
      uploader: req.params.id,
      isPublic: true
    })
      .populate(
        'uploader',
        'username avatar channelName'
      )
      .sort({
        createdAt: -1
      });

    res.json({
      success: true,
      count: videos.length,
      data: videos
    });

  } catch (error) {
    console.error('Get channel videos error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to get channel videos'
    });
  }
};


// Get subscription feed
exports.getSubscriptionFeed = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const videos = await Video.find({
      uploader: {
        $in: user.subscribedChannels
      },
      isPublic: true
    })
      .populate(
        'uploader',
        'username avatar channelName subscribers'
      )
      .sort({
        createdAt: -1
      })
      .limit(20);

    res.json({
      success: true,
      count: videos.length,
      data: videos
    });

  } catch (error) {
    console.error('Subscription feed error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to get subscription feed'
    });
  }
};