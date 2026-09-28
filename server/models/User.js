const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    studentId: { type: String, trim: true, default: '' },
    department: { type: String, trim: true, default: '' },
    batch: { type: String, trim: true, default: '' },
    bio: { type: String, maxlength: 300, default: '' },
    avatar: { type: String, default: '' },
    coverPhoto: { type: String, default: '' },
    joinedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
