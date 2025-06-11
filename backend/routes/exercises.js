// backend/routes/exercises.js

const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.level)    filter.level = req.query.level;
    if (req.query.gender)   filter.gender = req.query.gender;
    if (req.query.goal)     filter.goal = req.query.goal;

    const exercises = await Exercise.find(filter).sort({ name: 1 });
    res.json(exercises);
  } catch (err) {
    console.error('❌ Błąd GET /exercises:', err);
    res.status(500).json({ msg: 'Błąd serwera podczas pobierania ćwiczeń' });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, level, gender, goal } = req.body;
    if (!name || !category || !level || !gender || !goal) {
      return res.status(400).json({
        msg: 'Brakuje wymaganych pól: name, category, level, gender, goal'
      });
    }

    const newExercise = new Exercise({ name, category, level, gender, goal });
    await newExercise.save();
    res.status(201).json({ msg: 'Ćwiczenie dodane', exercise: newExercise });
  } catch (err) {
    console.error('❌ Błąd POST /exercises:', err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Ćwiczenie o takich parametrach już istnieje' });
    }
    if (err.name === 'ValidationError') {
      const key = Object.keys(err.errors)[0];
      const msg = err.errors[key].message;
      return res.status(400).json({ msg });
    }
    res.status(500).json({ msg: 'Błąd serwera podczas dodawania ćwiczenia' });
  }
});

router.post('/bulk', protect, adminOnly, async (req, res) => {
  try {
    const exercisesArray = req.body;
    if (!Array.isArray(exercisesArray) || exercisesArray.length === 0) {
      return res.status(400).json({ msg: 'Wyślij tablicę obiektów ćwiczeń' });
    }

    const docs = exercisesArray.map((ex) => {
      const { name, category, level, gender, goal } = ex;
      if (!name || !category || !level || !gender || !goal) {
        throw new Error(
          'Brakuje wymaganych pól w jednym z ćwiczeń (name, category, level, gender, goal)'
        );
      }
      return { name, category, level, gender, goal };
    });

    const inserted = await Exercise.insertMany(docs, { ordered: false });
    res.status(201).json({
      msg: 'Dodano ćwiczenia',
      count: inserted.length,
      exercises: inserted
    });
  } catch (err) {
    console.error('❌ Błąd POST /exercises/bulk:', err);
    if (err.message && err.message.includes('Brakuje wymaganych pól')) {
      return res.status(400).json({ msg: err.message });
    }
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Co najmniej jedno ćwiczenie duplikowało istniejące' });
    }
    if (err.name === 'ValidationError') {
      const key = Object.keys(err.errors)[0];
      const msg = err.errors[key].message;
      return res.status(400).json({ msg });
    }
    res.status(500).json({ msg: 'Błąd serwera podczas dodawania ćwiczeń' });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const exerciseId = req.params.id;
    const { name, category, level, gender, goal } = req.body;

    if (!name || !category || !level || !gender || !goal) {
      return res.status(400).json({
        msg: 'Brakuje wymaganych pól do edycji: name, category, level, gender, goal'
      });
    }

    console.log(`PUT /api/exercises/${exerciseId} – otrzymano body:`, req.body);

    const updated = await Exercise.findByIdAndUpdate(
      exerciseId,
      { name, category, level, gender, goal },
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    if (!updated) {
      return res.status(404).json({ msg: 'Nie znaleziono ćwiczenia do edycji' });
    }
    res.json({ msg: 'Ćwiczenie zaktualizowane', exercise: updated });
  } catch (err) {
    console.error('❌ Błąd PUT /exercises/:id:', err);

    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Ćwiczenie o takich parametrach już istnieje' });
    }
    if (err.name === 'ValidationError') {
      const key = Object.keys(err.errors)[0];
      const msg = err.errors[key].message;
      return res.status(400).json({ msg });
    }
    res.status(500).json({ msg: 'Błąd serwera podczas edycji ćwiczenia' });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Exercise.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Nie znaleziono ćwiczenia do usunięcia' });
    }
    res.json({ msg: 'Ćwiczenie usunięte.' });
  } catch (err) {
    console.error('❌ Błąd DELETE /exercises/:id:', err);
    res.status(500).json({ msg: 'Błąd serwera podczas usuwania ćwiczenia' });
  }
});

module.exports = router;
