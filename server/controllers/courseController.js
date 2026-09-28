const Course = require('../models/Course');
const User = require('../models/User');

// @route  GET /api/courses?category=&search=
const getCourses = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter)
      .select('-notes -videos')
      .populate('createdBy', 'name')
      .sort('-createdAt');

    res.json(courses);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/courses/:id
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('createdBy', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/courses (admin)
const createCourse = async (req, res, next) => {
  try {
    const { title, code, category, description, instructor, thumbnail } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const course = await Course.create({
      title,
      code,
      category,
      description,
      instructor,
      thumbnail,
      createdBy: req.user._id,
    });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/courses/:id (admin)
const updateCourse = async (req, res, next) => {
  try {
    const editable = ['title', 'code', 'category', 'description', 'instructor', 'thumbnail'];
    const updates = {};
    editable.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const course = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/courses/:id (admin)
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await User.updateMany({ enrolledCourses: course._id }, { $pull: { enrolledCourses: course._id } });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/courses/:id/enroll
const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const alreadyEnrolled = course.enrolledStudents.some((id) => id.equals(req.user._id));
    if (alreadyEnrolled) {
      course.enrolledStudents.pull(req.user._id);
      await User.findByIdAndUpdate(req.user._id, { $pull: { enrolledCourses: course._id } });
    } else {
      course.enrolledStudents.push(req.user._id);
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: course._id } });
    }
    await course.save();
    res.json({ enrolled: !alreadyEnrolled, enrolledCount: course.enrolledStudents.length });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/courses/:id/videos (admin)
const addVideo = async (req, res, next) => {
  try {
    const { title, url, duration } = req.body;
    if (!title || !url) return res.status(400).json({ message: 'Video title and URL are required' });

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.videos.push({ title, url, duration, order: course.videos.length });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/courses/:id/videos/:videoId (admin)
const deleteVideo = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    course.videos.id(req.params.videoId)?.deleteOne();
    await course.save();
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/courses/:id/notes (admin)
const addNote = async (req, res, next) => {
  try {
    const { title, fileUrl } = req.body;
    if (!title || !fileUrl) return res.status(400).json({ message: 'Note title and file are required' });

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.notes.push({ title, fileUrl });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/courses/:id/notes/:noteId (admin)
const deleteNote = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    course.notes.id(req.params.noteId)?.deleteOne();
    await course.save();
    res.json(course);
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};
