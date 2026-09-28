const express = require('express');
const {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  toggleJoinClub,
  addUpdate,
  deleteUpdate,
} = require('../controllers/clubController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getClubs);
router.post('/', adminOnly, createClub);
router.get('/:id', getClubById);
router.put('/:id', adminOnly, updateClub);
router.delete('/:id', adminOnly, deleteClub);
router.post('/:id/join', toggleJoinClub);
router.post('/:id/updates', adminOnly, addUpdate);
router.delete('/:id/updates/:updateId', adminOnly, deleteUpdate);

module.exports = router;
