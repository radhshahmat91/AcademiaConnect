const Notice = require('../models/Notice');

// @route  GET /api/notices?category=
const getNotices = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;

    const notices = await Notice.find(filter)
      .populate('postedBy', 'name')
      .sort({ important: -1, createdAt: -1 });
    res.json(notices);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/notices/:id
const getNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('postedBy', 'name');
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/notices (admin)
const createNotice = async (req, res, next) => {
  try {
    const { title, content, category, important } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

    const notice = await Notice.create({
      title,
      content,
      category,
      important: Boolean(important),
      postedBy: req.user._id,
    });
    res.status(201).json(notice);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/notices/:id (admin)
const updateNotice = async (req, res, next) => {
  try {
    const editable = ['title', 'content', 'category', 'important'];
    const updates = {};
    editable.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const notice = await Notice.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/notices/:id (admin)
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotices, getNoticeById, createNotice, updateNotice, deleteNotice };
