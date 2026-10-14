const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.protect = async (req, res, next) => { try { const token = req.headers.authorization?.split(' ')[1]; if (!token) return res.status(401).json({ message: 'Authentication required.' }); const decoded = jwt.verify(token, process.env.JWT_SECRET); req.user = await User.findById(decoded.id); if (!req.user) return res.status(401).json({ message: 'User no longer exists.' }); next(); } catch { res.status(401).json({ message: 'Invalid or expired token.' }); } };
exports.allow = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have permission for this action.' });
