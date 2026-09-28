const express = require('express');
const { getStats, getAllUsers, updateUserRole, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
