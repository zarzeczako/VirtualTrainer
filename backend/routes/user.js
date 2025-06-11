// backend/routes/user.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const generatePlan = require('../utils/generatePlan');
const upload = require('../middleware/upload');


router.post('/profile', protect, async (req, res) => {
  try {
    const { goal, weight, height, level, avatar = '', gender } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Użytkownik nie znaleziony' });
    }

    user.profile = { goal, weight, height, level, avatar, gender };

    const plan = await generatePlan(goal, gender, level);

    const missingCats = plan
      .filter(day => day.nazwa !== 'Odpoczynek' && Array.isArray(day.ćwiczenia) && day.ćwiczenia.length === 0)
      .map(day => day.nazwa);
    const uniqueMissing = [...new Set(missingCats)];
    let warning = null;
    if (uniqueMissing.length > 0) {
      warning = `Brak ćwiczeń w bazie dla kategorii: ${uniqueMissing.join(', ')}`;
    }

    user.weeklyPlan = plan;
    await user.save();

    return res.json({
      msg: '✅ Cel zaktualizowany, plan wygenerowany pomyślnie',
      weeklyPlan: user.weeklyPlan,
      ...(warning ? { warning } : {}) 
    });
  } catch (err) {
    console.error('❌ Błąd aktualizacji profilu / generowania planu:', err);
    return res.status(500).json({
      msg: 'Nie udało się wygenerować planu',
      error: err.message
    });
  }
});


router.patch('/profile/goals', protect, async (req, res) => {
  try {
    const { goal, weight, level } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Użytkownik nie znaleziony' });
    }

    if (!goal || !weight || !level) {
      return res.status(400).json({ msg: '⚠️ Uzupełnij wszystkie pola' });
    }

    user.profile.goal = goal;
    user.profile.weight = weight;
    user.profile.level = level;

    const plan = await generatePlan(goal, user.profile.gender, level);

    const missingCats = plan
      .filter(day => day.nazwa !== 'Odpoczynek' && Array.isArray(day.ćwiczenia) && day.ćwiczenia.length === 0)
      .map(day => day.nazwa);
    const uniqueMissing = [...new Set(missingCats)];
    let warning = null;
    if (uniqueMissing.length > 0) {
      warning = `Brak ćwiczeń w bazie dla kategorii: ${uniqueMissing.join(', ')}`;
    }

    user.weeklyPlan = plan;
    await user.save();

    return res.json({
      msg: '✅ Cele zaktualizowane i plan wygenerowany',
      weeklyPlan: user.weeklyPlan,
      ...(warning ? { warning } : {})
    });
  } catch (err) {
    console.error('[❌ Błąd aktualizacji celów]:', err);
    return res.status(500).json({ msg: 'Błąd serwera', error: err.message });
  }
});


router.post('/generate-plan', protect, async (req, res) => {
  try {
   
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Użytkownik nie znaleziony' });
    }

    const { goal, level, gender, weight } = user.profile || {};
    if (!goal || !level || !gender || !weight) {
      return res.status(400).json({
        msg: '⚠️ Uzupełnij swój profil: cel, poziom, płeć i waga są wymagane, aby wygenerować plan.'
      });
    }

    const plan = await generatePlan(goal, gender, level);

    const missingCats = plan
      .filter(day => day.nazwa !== 'Odpoczynek' && Array.isArray(day.ćwiczenia) && day.ćwiczenia.length === 0)
      .map(day => day.nazwa);
    const uniqueMissing = [...new Set(missingCats)];
    let warning = null;
    if (uniqueMissing.length > 0) {
      warning = `Brak ćwiczeń w bazie dla kategorii: ${uniqueMissing.join(', ')}`;
    }

    user.weeklyPlan = plan;
    await user.save();

    return res.json({
      msg: '✅ Plan treningowy wygenerowany ponownie',
      weeklyPlan: user.weeklyPlan,
      ...(warning ? { warning } : {})
    });
  } catch (err) {
    console.error('[❌ Błąd generowania planu]:', err);
    return res.status(500).json({ msg: 'Błąd serwera', error: err.message });
  }
});


router.patch('/profile/info', protect, async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Użytkownik nie znaleziony' });

    if (avatar !== undefined) {
      user.profile.avatar = avatar;
    }
    await user.save();
    return res.json({ msg: '✅ Profil zaktualizowany' });
  } catch (err) {
    console.error('[❌ Błąd aktualizacji info]:', err);
    return res.status(500).json({ msg: 'Błąd serwera' });
  }
});

// =======================================================
// 5) PATCH /api/user/profile/avatar → upload avatara
// =======================================================
router.patch('/profile/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Użytkownik nie znaleziony' });

    user.profile.avatar = `/avatars/${req.file.filename}`;
    await user.save();
    return res.json({ msg: '✅ Avatar zaktualizowany', avatar: user.profile.avatar });
  } catch (err) {
    console.error('❌ Upload avatar fail:', err);
    return res.status(500).json({ msg: 'Błąd uploadu avatara' });
  }
});

module.exports = router;
