const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    duration: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    code: { type: String, trim: true, default: '' },
    category: {
      type: String,
      required: true,
      enum: [
        'Data Structures',
        'Algorithms',
        'Artificial Intelligence',
        'Theory of Computation',
        'Database Systems',
        'Computer Networks',
        'Operating Systems',
        'Web Development',
        'Software Engineering',
        'Other',
      ],
    },
    description: { type: String, default: '', maxlength: 2000 },
    instructor: { type: String, default: '', trim: true },
    thumbnail: { type: String, default: '' },
    videos: [videoSchema],
    notes: [noteSchema],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text', code: 'text' });

module.exports = mongoose.model('Course', courseSchema);
