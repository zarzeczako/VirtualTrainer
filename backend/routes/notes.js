// routes/notes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const UserNote = require('../models/UserNote');

// 🟢 Get all notes for current user
router.get('/', protect, async (req, res) => {
  const notes = await UserNote.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notes);
});

// 🟡 Add new note
router.post('/', protect, async (req, res) => {
  const newNote = await UserNote.create({
    user: req.user.id,
    text: req.body.text
  });
  res.status(201).json(newNote);
});

// 🟠 Update note
router.patch('/:id', protect, async (req, res) => {
  const note = await UserNote.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { text: req.body.text },
    { new: true }
  );
  if (!note) return res.status(404).json({ msg: 'Notatka nie znaleziona' });
  res.json(note);
});

// 🔴 Delete note
router.delete('/:id', protect, async (req, res) => {
  const deleted = await UserNote.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });
  if (!deleted) return res.status(404).json({ msg: 'Notatka nie znaleziona' });
  res.json({ msg: '🗑️ Notatka usunięta' });
});

module.exports = router;
