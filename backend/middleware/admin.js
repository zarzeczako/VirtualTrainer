// backend/middleware/admin.js

exports.adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: 'Brak uwierzytelnienia' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Dostęp tylko dla administratora' });
  }
  next();
};
