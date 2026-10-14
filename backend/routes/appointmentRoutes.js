const express = require('express');
const router = express.Router();
const { createAppointment, getUserAppointments } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes (Requires Bearer token in headers)
router.post('/', protect, createAppointment);
router.get('/', protect, getUserAppointments);

module.exports = router;