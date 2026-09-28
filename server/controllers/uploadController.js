// @route  POST /api/upload  (multipart/form-data, field name "file")
// Generic upload used for avatars, course thumbnails, club logos/covers, event images, and course notes.
const handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(201).json({
    url: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname,
  });
};

module.exports = { handleUpload };
