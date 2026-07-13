const express = require('express');
const router = express.Router();

const {
  getVideos,
  getVideo,
  uploadVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  getTrendingVideos,
  getRelatedVideos,
} = require('../controllers/videoController');

const { protect, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public Routes
router.get('/', getVideos);
router.get('/trending', getTrendingVideos);

// Upload Video (Protected)
router.post(
  '/upload',
  protect,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  uploadVideo
);

// Dynamic Routes
router.get('/:id', optionalAuth, getVideo);
router.get('/:id/related', getRelatedVideos);

// Protected Routes
router.put('/:id', protect, upload.single('thumbnail'), updateVideo);
router.delete('/:id', protect, deleteVideo);
router.post('/:id/like', protect, likeVideo);
router.post('/:id/dislike', protect, dislikeVideo);

module.exports = router;