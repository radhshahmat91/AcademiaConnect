const express = require('express');
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getNotices);
router.post('/', adminOnly, createNotice);
router.get('/:id', getNoticeById);
router.put('/:id', adminOnly, updateNotice);
router.delete('/:id', adminOnly, deleteNotice);

module.exports = router;
