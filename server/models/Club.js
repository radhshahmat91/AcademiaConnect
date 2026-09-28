const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, maxlength: 3000 },
    image: { type: String, default: '' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, maxlength: 100 },
    category: { type: String, default: 'General', trim: true },
    description: { type: String, default: '', maxlength: 2000 },
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    updates: [updateSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Club', clubSchema);
