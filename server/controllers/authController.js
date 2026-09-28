const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @route  POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, studentId, department, batch } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // First-ever account on a fresh database becomes an admin automatically,
    // so there's always at least one admin without manually editing the DB.
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'student';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      studentId,
      department,
      batch,
      role,
    });

    const token = generateToken(user._id);
    res.status(201).json({ user: user.toSafeObject(), token });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({ user: user.toSafeObject(), token });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('joinedClubs', 'name logo')
      .populate('enrolledCourses', 'title category thumbnail');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
