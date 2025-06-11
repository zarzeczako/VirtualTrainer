// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1) Walidacja pól
    if (!username || !password) {
      return res.status(400).json({ msg: 'Wszystkie pola są wymagane.' });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ msg: 'Nazwa użytkownika musi mieć co najmniej 3 znaki.' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: 'Hasło musi mieć co najmniej 6 znaków.' });
    }


    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ msg: 'Taka nazwa użytkownika już istnieje.' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        profile: newUser.profile
      }
    });
  } catch (err) {
    console.error('❌ Błąd rejestracji:', err);
    res.status(500).json({ msg: 'Błąd serwera podczas rejestracji.' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: 'Wszystkie pola są wymagane.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Nieprawidłowe dane logowania.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Nieprawidłowe dane logowania.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (err) {
    console.error('❌ Błąd logowania:', err);
    res.status(500).json({ msg: 'Błąd serwera podczas logowania.' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'Brak tokena.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Użytkownik nie znaleziony.' });
    }
    res.json(user);
  } catch (err) {
    console.error('❌ Błąd w /auth/me:', err);
    res.status(401).json({ msg: 'Token nieprawidłowy lub wygasł.' });
  }
});

module.exports = router;
