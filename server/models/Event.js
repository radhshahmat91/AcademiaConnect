const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, default: '', maxlength: 2000 },
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', default: null },
    date: { type: Date, required: true },
    time: { type: String, default: '' },
    location: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
    organizer: { type: String, default: '', trim: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
