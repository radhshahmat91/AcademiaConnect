const express = require('express');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleAttendEvent,
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getEvents);
router.post('/', adminOnly, createEvent);
router.get('/:id', getEventById);
router.put('/:id', adminOnly, updateEvent);
router.delete('/:id', adminOnly, deleteEvent);
router.post('/:id/attend', toggleAttendEvent);

module.exports = router;
