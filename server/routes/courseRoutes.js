const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  addVideo,
  deleteVideo,
  addNote,
  deleteNote,
} = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getCourses);
router.post('/', adminOnly, createCourse);
router.get('/:id', getCourseById);
router.put('/:id', adminOnly, updateCourse);
router.delete('/:id', adminOnly, deleteCourse);
router.post('/:id/enroll', enrollCourse);
router.post('/:id/videos', adminOnly, addVideo);
router.delete('/:id/videos/:videoId', adminOnly, deleteVideo);
router.post('/:id/notes', adminOnly, addNote);
router.delete('/:id/notes/:noteId', adminOnly, deleteNote);

module.exports = router;
