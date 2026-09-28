const express = require('express');
const { getUsers, getUserById, updateMe, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getUsers);
router.put('/me', updateMe);
router.put('/me/password', changePassword);
router.get('/:id', getUserById);

module.exports = router;
