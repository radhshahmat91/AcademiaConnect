const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true, maxlength: 5000 },
    category: {
      type: String,
      enum: ['Academic', 'Exam', 'Event', 'Holiday', 'General', 'Urgent'],
      default: 'General',
    },
    important: { type: Boolean, default: false },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
