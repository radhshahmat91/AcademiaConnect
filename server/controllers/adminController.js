const User = require('../models/User');
const Course = require('../models/Course');
const Club = require('../models/Club');
const Event = require('../models/Event');
const Notice = require('../models/Notice');

// @route  GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [userCount, studentCount, courseCount, clubCount, eventCount, noticeCount, upcomingEventCount] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'student' }),
        Course.countDocuments(),
        Club.countDocuments(),
        Event.countDocuments(),
        Notice.countDocuments(),
        Event.countDocuments({ date: { $gte: new Date() } }),
      ]);

    const recentNotices = await Notice.find().sort('-createdAt').limit(5).populate('postedBy', 'name');

    res.json({
      userCount,
      studentCount,
      courseCount,
      clubCount,
      eventCount,
      noticeCount,
      upcomingEventCount,
      recentNotices,
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/admin/users/:id/role
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be student or admin' });
    }
    if (String(req.user._id) === req.params.id) {
      return res.status(400).json({ message: "You can't change your own role" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    if (String(req.user._id) === req.params.id) {
      return res.status(400).json({ message: "You can't delete your own account" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats, getAllUsers, updateUserRole, deleteUser };
