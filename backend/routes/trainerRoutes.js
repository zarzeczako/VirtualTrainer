// backend/routes/trainerRoutes.js ✅
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Przykładowy zabezpieczony endpoint
router.get('/', protect, (req, res) => {
  res.json({ msg: 'Dostęp przyznany, jesteś zalogowany!' });
});

module.exports = router;
