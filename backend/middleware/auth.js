// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'Brak tokena, autoryzacja odrzucona' });
  }

  try {
    // Weryfikacja tokena
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
   
    next();
  } catch (err) {
    console.error('❌ Błąd w middleware protect:', err);
    res.status(401).json({ msg: 'Token niepoprawny lub wygasł' });
  }
};
