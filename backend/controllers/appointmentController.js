const Appointment = require('../models/Appointment');

// @desc    Book a new appointment
// @route   POST /api/appointments
exports.bookAppointment = async (req, res) => {
  try {
    const { userId, doctorId, doctorName, specialty, date, timeSlot, symptoms } = req.body;

    if (!userId || !doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: 'Missing required appointment fields' });
    }

    // Check slot availability
    const existingBooking = await Appointment.findOne({ doctorId, date, timeSlot, status: 'Scheduled' });
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked. Please pick another time.' });
    }

    const newAppointment = new Appointment({
      userId,
      doctorId,
      doctorName,
      specialty,
      date,
      timeSlot,
      symptoms,
    });

    await newAppointment.save();

    res.status(201).json({
      message: 'Appointment booked successfully!',
      appointment: newAppointment,
    });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Failed to book appointment' });
  }
};

// @desc    Get appointments for a logged-in user
// @route   GET /api/appointments/user/:userId
exports.getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ userId }).sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    console.error('Fetch Appointments Error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};