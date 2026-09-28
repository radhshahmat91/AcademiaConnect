const express = require('express');
const { handleUpload } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', protect, upload.single('file'), handleUpload);

module.exports = router;
