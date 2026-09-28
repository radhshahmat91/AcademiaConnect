const Club = require('../models/Club');
const User = require('../models/User');

// @route  GET /api/clubs?category=&search=
const getClubs = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const clubs = await Club.find(filter).select('-updates').sort('-createdAt');
    res.json(clubs);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/clubs/:id
const getClubById = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('members', 'name avatar department')
      .populate('updates.postedBy', 'name avatar');
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/clubs (admin)
const createClub = async (req, res, next) => {
  try {
    const { name, category, description, logo, coverImage } = req.body;
    if (!name) return res.status(400).json({ message: 'Club name is required' });

    const club = await Club.create({
      name,
      category,
      description,
      logo,
      coverImage,
      createdBy: req.user._id,
    });
    res.status(201).json(club);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/clubs/:id (admin)
const updateClub = async (req, res, next) => {
  try {
    const editable = ['name', 'category', 'description', 'logo', 'coverImage'];
    const updates = {};
    editable.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const club = await Club.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/clubs/:id (admin)
const deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    await User.updateMany({ joinedClubs: club._id }, { $pull: { joinedClubs: club._id } });
    res.json({ message: 'Club deleted' });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/clubs/:id/join  (toggles join/leave)
const toggleJoinClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const isMember = club.members.some((id) => id.equals(req.user._id));
    if (isMember) {
      club.members.pull(req.user._id);
      await User.findByIdAndUpdate(req.user._id, { $pull: { joinedClubs: club._id } });
    } else {
      club.members.push(req.user._id);
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { joinedClubs: club._id } });
    }
    await club.save();
    res.json({ joined: !isMember, memberCount: club.members.length });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/clubs/:id/updates (admin)
const addUpdate = async (req, res, next) => {
  try {
    const { title, content, image } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Update title and content are required' });
    }

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    club.updates.unshift({ title, content, image, postedBy: req.user._id });
    await club.save();
    const populated = await club.populate('updates.postedBy', 'name avatar');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/clubs/:id/updates/:updateId (admin)
const deleteUpdate = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    club.updates.id(req.params.updateId)?.deleteOne();
    await club.save();
    res.json(club);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  toggleJoinClub,
  addUpdate,
  deleteUpdate,
};
