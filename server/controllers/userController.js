const User = require('../models/User');

// @route  GET /api/users?search=
// Used by the messaging page to find people to start a conversation with.
const getUsers = async (req, res, next) => {
  try {
    const { search = '' } = req.query;
    const filter = { _id: { $ne: req.user._id } };

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).select('name email avatar department role').limit(30);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('joinedClubs', 'name logo')
      .populate('enrolledCourses', 'title category thumbnail');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/users/me
const updateMe = async (req, res, next) => {
  try {
    const editable = ['name', 'bio', 'department', 'batch', 'studentId', 'avatar', 'coverPhoto'];
    const updates = {};
    editable.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/users/me/password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUserById, updateMe, changePassword };
