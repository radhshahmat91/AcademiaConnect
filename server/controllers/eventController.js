const Event = require('../models/Event');

// @route  GET /api/events?upcoming=true
const getEvents = async (req, res, next) => {
  try {
    const { upcoming, club } = req.query;
    const filter = {};
    if (club) filter.club = club;
    if (upcoming === 'true') filter.date = { $gte: new Date() };

    const events = await Event.find(filter)
      .populate('club', 'name logo')
      .sort(upcoming === 'true' ? 'date' : '-date');
    res.json(events);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/events/:id
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club', 'name logo')
      .populate('attendees', 'name avatar department');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/events (admin)
const createEvent = async (req, res, next) => {
  try {
    const { title, description, club, date, time, location, image, organizer } = req.body;
    if (!title || !date) return res.status(400).json({ message: 'Title and date are required' });

    const event = await Event.create({
      title,
      description,
      club: club || null,
      date,
      time,
      location,
      image,
      organizer,
      createdBy: req.user._id,
    });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/events/:id (admin)
const updateEvent = async (req, res, next) => {
  try {
    const editable = ['title', 'description', 'club', 'date', 'time', 'location', 'image', 'organizer'];
    const updates = {};
    editable.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/events/:id (admin)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/events/:id/attend (toggles attend/un-attend)
const toggleAttendEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isAttending = event.attendees.some((id) => id.equals(req.user._id));
    if (isAttending) {
      event.attendees.pull(req.user._id);
    } else {
      event.attendees.push(req.user._id);
    }
    await event.save();
    res.json({ attending: !isAttending, attendeeCount: event.attendees.length });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleAttendEvent,
};
