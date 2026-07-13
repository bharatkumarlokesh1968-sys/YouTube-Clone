const express = require('express');
const router = express.Router({ mergeParams: true });
const { getComments, addComment, updateComment, deleteComment, likeComment, addReply } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:videoId/comments', getComments);
router.post('/:videoId/comments', protect, addComment);
router.put('/comments/:id', protect, updateComment);
router.delete('/comments/:id', protect, deleteComment);
router.post('/comments/:id/like', protect, likeComment);
router.post('/comments/:id/reply', protect, addReply);

module.exports = router;
