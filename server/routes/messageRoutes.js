const express = require('express');
const {
  getConversations,
  getOrCreateConversationWithUser,
  sendMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/conversations', getConversations);
router.get('/with/:userId', getOrCreateConversationWithUser);
router.post('/', sendMessage);

module.exports = router;
