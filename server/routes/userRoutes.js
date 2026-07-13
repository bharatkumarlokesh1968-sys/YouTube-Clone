const express = require('express');
const router = express.Router();
const { getUser, updateUser, subscribeToChannel, getChannelVideos, getSubscriptionFeed } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/feed', protect, getSubscriptionFeed);
router.get('/:id', getUser);
router.put('/update', protect, upload.single('avatar'), updateUser);
router.post('/:id/subscribe', protect, subscribeToChannel);
router.get('/:id/videos', getChannelVideos);

module.exports = router;
