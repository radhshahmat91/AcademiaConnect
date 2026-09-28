const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { getIO } = require('../socket/socketHandler');

// @route  GET /api/messages/conversations
// Lists all conversations the logged-in user is part of, newest first.
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name avatar department')
      .sort('-lastMessageAt');

    // Shape each conversation around "the other person" for a 1:1 inbox view.
    const shaped = conversations.map((c) => {
      const other = c.participants.find((p) => !p._id.equals(req.user._id));
      return {
        _id: c._id,
        otherUser: other,
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt,
      };
    });

    res.json(shaped);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/messages/with/:userId
// Gets (or lazily creates) the 1:1 conversation with another user, plus its message history.
const getOrCreateConversationWithUser = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;
    if (otherUserId === String(req.user._id)) {
      return res.status(400).json({ message: "You can't message yourself" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, otherUserId], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [req.user._id, otherUserId] });
    }

    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', 'name avatar')
      .sort('createdAt');

    // Mark incoming messages as read now that the recipient has opened the thread.
    await Message.updateMany(
      { conversation: conversation._id, sender: otherUserId, read: false },
      { read: true }
    );

    res.json({ conversationId: conversation._id, messages });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/messages
const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content || !content.trim()) {
      return res.status(400).json({ message: 'receiverId and content are required' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId], $size: 2 },
    });
    if (!conversation) {
      conversation = await Conversation.create({ participants: [req.user._id, receiverId] });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      content: content.trim(),
    });

    conversation.lastMessage = content.trim();
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populated = await message.populate('sender', 'name avatar');

    // Push it live to the recipient if they're connected right now.
    try {
      getIO().to(String(receiverId)).emit('newMessage', {
        conversationId: conversation._id,
        message: populated,
      });
    } catch (socketErr) {
      // Socket not initialized (e.g. in tests) - message is still saved via REST.
    }

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

module.exports = { getConversations, getOrCreateConversationWithUser, sendMessage };
