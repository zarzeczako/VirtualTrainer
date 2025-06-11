// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const weeklyPlanSchema = new mongoose.Schema({
  nazwa:    { type: String, required: true },
  ćwiczenia: [{ type: String }]
}, { _id: false });

const userSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    goal:    { type: String, enum: ['masa','redukcja','utrzymanie'] },
    weight:  { type: Number },
    height:  { type: Number },
    level:   { type: String, enum: ['początkujący','średniozaawansowany','zaawansowany'] },
    avatar:  { type: String, default: '' },
    gender:  { type: String, enum: ['mężczyzna','kobieta','uniwersalne'] }
  },
  weeklyPlan: {
    type: [weeklyPlanSchema],
    default: []
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
