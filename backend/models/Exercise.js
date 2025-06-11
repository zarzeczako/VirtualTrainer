// backend/models/Exercise.js

const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Push',
      'Pull',
      'Legs',
      'Full body',
      'Core',
      'Cardio',
      'HIIT',
      'Rest',
      'Stretching + Mobility'
    ]
  },
  level: {
    type: String,
    required: true,
    enum: ['początkujący', 'średniozaawansowany', 'zaawansowany']
  },
  gender: {
    type: String,
    required: true,
    enum: ['uniwersalne', 'mężczyzna', 'kobieta']
  },
  goal: {
    type: String,
    required: true,
    enum: ['masa', 'redukcja', 'utrzymanie']
  }
});

exerciseSchema.index({ name: 1, level: 1, goal: 1 }, { unique: true });

module.exports = mongoose.model('Exercise', exerciseSchema);
