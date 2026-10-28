const express = require('express');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const { protect, allow } = require('../middleware/auth');
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const InterpreterProfile = require('../models/InterpreterProfile');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');
const InterpreterRequest = require('../models/InterpreterRequest');
const Prescription = require('../models/Prescription');
const Message = require('../models/Message');
const { languageNames, translateText } = require('../services/translation');
const router = express.Router();
const tokenFor = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, preferredLanguage: user.preferredLanguage, phone: user.phone });

router.post('/auth/register', async (req, res, next) => { try {
  const { name, email, password, role = 'patient', preferredLanguage = 'en', phone = '' } = req.body;
  if (!name || !email || !password || !['patient', 'doctor', 'interpreter'].includes(role)) return res.status(400).json({ message: 'Name, email, password, and a valid role are required.' });
  if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = await User.create({ name, email, password, role, preferredLanguage, phone });
  if (role === 'doctor') await DoctorProfile.create({ user: user._id });
  if (role === 'interpreter') await InterpreterProfile.create({ user: user._id, languages: [preferredLanguage] });
  res.status(201).json({ token: tokenFor(user), user: safeUser(user) });
} catch (error) { next(error); } });
router.post('/auth/login', async (req, res, next) => { try {
  const user = await User.findOne({ email: req.body.email?.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password || ''))) return res.status(401).json({ message: 'Incorrect email or password.' });
  res.json({ token: tokenFor(user), user: safeUser(user) });
} catch (error) { next(error); } });
router.get('/auth/me', protect, (req, res) => res.json({ user: safeUser(req.user) }));
router.patch('/users/me', protect, async (req, res, next) => { try { ['name', 'phone', 'preferredLanguage'].forEach((key) => { if (req.body[key] !== undefined) req.user[key] = req.body[key]; }); await req.user.save(); res.json({ user: safeUser(req.user) }); } catch (error) { next(error); } });

router.get('/doctors', protect, async (req, res, next) => { try {
  const filter = {}; if (req.query.language) filter.languages = req.query.language; if (req.query.specialization) filter.specialization = new RegExp(req.query.specialization, 'i');
  const profiles = await DoctorProfile.find(filter).populate('user', 'name preferredLanguage');
  const search = req.query.search?.toLowerCase();
  res.json(profiles.filter((p) => !search || p.user.name.toLowerCase().includes(search) || p.specialization.toLowerCase().includes(search)));
} catch (error) { next(error); } });
router.post('/doctors/seed', async (req, res, next) => { try {
  if (process.env.NODE_ENV === 'production') return res.status(404).json({ message: 'Route not found.' });
  const sampleDoctors = [
    { name: 'Dr. Ananya Sharma', email: 'ananya.doctor@example.com', specialization: 'General Medicine', languages: ['en', 'hi', 'ta'] },
    { name: 'Dr. Rajesh Kumar', email: 'rajesh.doctor@example.com', specialization: 'Cardiology', languages: ['en', 'ta'] },
    { name: 'Dr. Priya Patel', email: 'priya.doctor@example.com', specialization: 'Pediatrics', languages: ['en', 'hi'] },
  ];
  for (const sample of sampleDoctors) {
    let user = await User.findOne({ email: sample.email });
    if (!user) user = await User.create({ name: sample.name, email: sample.email, password: 'Doctor123!', role: 'doctor', preferredLanguage: sample.languages[0] });
    await DoctorProfile.findOneAndUpdate({ user: user._id }, { specialization: sample.specialization, languages: sample.languages }, { upsert: true, new: true, setDefaultsOnInsert: true });
  }
  res.json({ message: 'Development doctors are ready.', count: sampleDoctors.length });
} catch (error) { next(error); } });
router.get('/doctors/me', protect, allow('doctor'), async (req, res, next) => { try { res.json(await DoctorProfile.findOne({ user: req.user._id })); } catch (error) { next(error); } });
router.patch('/doctors/me', protect, allow('doctor'), async (req, res, next) => { try { const profile = await DoctorProfile.findOneAndUpdate({ user: req.user._id }, req.body, { new: true, runValidators: true }); res.json(profile); } catch (error) { next(error); } });
router.get('/interpreters/me', protect, allow('interpreter'), async (req, res, next) => { try { res.json(await InterpreterProfile.findOne({ user: req.user._id })); } catch (error) { next(error); } });
router.patch('/interpreters/me', protect, allow('interpreter'), async (req, res, next) => { try { res.json(await InterpreterProfile.findOneAndUpdate({ user: req.user._id }, req.body, { new: true, runValidators: true })); } catch (error) { next(error); } });

router.post('/appointments', protect, allow('patient'), async (req, res, next) => { try { const { doctor, scheduledAt, reason } = req.body; if (!doctor || !scheduledAt) return res.status(400).json({ message: 'Doctor and appointment time are required.' }); if (new Date(scheduledAt) <= new Date()) return res.status(400).json({ message: 'Choose a future appointment time.' }); if (!await User.exists({ _id: doctor, role: 'doctor' })) return res.status(404).json({ message: 'Doctor not found.' }); const appointment = await Appointment.create({ patient: req.user._id, doctor, scheduledAt, reason }); req.app.get('io').to(`user:${doctor}`).emit('appointment-created', { appointmentId: appointment._id }); res.status(201).json(appointment); } catch (error) { next(error); } });
router.get('/appointments', protect, async (req, res, next) => { try { const match = req.user.role === 'patient' ? { patient: req.user._id } : req.user.role === 'doctor' ? { doctor: req.user._id } : {}; res.json(await Appointment.find(match).populate('patient doctor', 'name email preferredLanguage').sort({ scheduledAt: 1 })); } catch (error) { next(error); } });
router.patch('/appointments/:id', protect, async (req, res, next) => { try { const appointment = await Appointment.findById(req.params.id); if (!appointment) return res.status(404).json({ message: 'Appointment not found.' }); const permitted = appointment.patient.equals(req.user._id) || appointment.doctor.equals(req.user._id); if (!permitted) return res.status(403).json({ message: 'Not your appointment.' }); if (req.body.status && ['accepted', 'cancelled', 'completed'].includes(req.body.status)) appointment.status = req.body.status; await appointment.save(); res.json(appointment); } catch (error) { next(error); } });

router.post('/consultations', protect, async (req, res, next) => { try { const appointment = await Appointment.findById(req.body.appointment); if (!appointment) return res.status(404).json({ message: 'Appointment not found.' }); if (!appointment.patient.equals(req.user._id) && !appointment.doctor.equals(req.user._id)) return res.status(403).json({ message: 'Not your appointment.' }); let consultation = await Consultation.findOne({ appointment: appointment._id }); if (!consultation) consultation = await Consultation.create({ appointment: appointment._id, doctor: appointment.doctor, patient: appointment.patient, roomId: randomUUID() }); await consultation.populate('doctor patient interpreter', 'name preferredLanguage'); res.status(201).json(consultation); } catch (error) { next(error); } });
router.get('/consultations', protect, async (req, res, next) => { try { const query = req.user.role === 'doctor' ? { doctor: req.user._id } : req.user.role === 'patient' ? { patient: req.user._id } : { interpreter: req.user._id }; res.json(await Consultation.find(query).populate('doctor patient interpreter', 'name').populate('appointment')); } catch (error) { next(error); } });
router.patch('/consultations/:id', protect, allow('doctor'), async (req, res, next) => { try { const item = await Consultation.findOneAndUpdate({ _id: req.params.id, doctor: req.user._id }, { notes: req.body.notes, diagnosis: req.body.diagnosis, status: req.body.status }, { new: true }); if (!item) return res.status(404).json({ message: 'Consultation not found.' }); res.json(item); } catch (error) { next(error); } });
router.get('/consultations/:id/messages', protect, async (req, res, next) => { try { const messages = await Message.find({ consultation: req.params.id }).populate('sender', 'name role preferredLanguage').sort({ createdAt: 1 }); const translatedMessages = await Promise.all(messages.map(async (message) => { const item = message.toObject(); if (message.sender._id.equals(req.user._id)) return item; try { const translated = await translateText(message.text, message.language, req.user.preferredLanguage || 'en'); return { ...item, text: translated, originalText: message.text, translated: translated !== message.text, language: req.user.preferredLanguage || 'en' }; } catch { return item; } })); res.json(translatedMessages); } catch (error) { next(error); } });
router.post('/prescriptions', protect, allow('doctor'), async (req, res, next) => { try { const consultation = await Consultation.findOne({ _id: req.body.consultation, doctor: req.user._id }); if (!consultation) return res.status(404).json({ message: 'Consultation not found.' }); res.status(201).json(await Prescription.create({ ...req.body, doctor: req.user._id, patient: consultation.patient })); } catch (error) { next(error); } });
router.get('/prescriptions', protect, async (req, res, next) => { try { const query = req.user.role === 'doctor' ? { doctor: req.user._id } : { patient: req.user._id }; res.json(await Prescription.find(query).populate('consultation').sort({ createdAt: -1 })); } catch (error) { next(error); } });

router.post('/interpreter-requests', protect, async (req, res, next) => { try { const consultation = await Consultation.findById(req.body.consultation); if (!consultation) return res.status(404).json({ message: 'Consultation not found.' }); const request = await InterpreterRequest.create({ consultation: consultation._id, requestedBy: req.user._id, language: req.body.language || 'en' }); const available = await InterpreterProfile.find({ languages: request.language, isAvailable: true }); req.app.get('io').to('interpreters').emit('interpreter-request', request); res.status(201).json({ request, availableInterpreters: available.length }); } catch (error) { next(error); } });
router.get('/interpreter-requests', protect, allow('interpreter'), async (req, res, next) => { try { const profile = await InterpreterProfile.findOne({ user: req.user._id }); res.json(await InterpreterRequest.find({ status: 'open', language: { $in: profile.languages } }).populate('consultation requestedBy')); } catch (error) { next(error); } });
router.patch('/interpreter-requests/:id', protect, allow('interpreter'), async (req, res, next) => { try { const request = await InterpreterRequest.findById(req.params.id); if (!request) return res.status(404).json({ message: 'Request not found.' }); request.status = req.body.status === 'accepted' ? 'accepted' : 'declined'; request.interpreter = req.user._id; await request.save(); let consultation; if (request.status === 'accepted') consultation = await Consultation.findByIdAndUpdate(request.consultation, { interpreter: req.user._id }, { new: true }).populate('doctor patient interpreter', 'name preferredLanguage'); req.app.get('io').to(`consultation:${request.consultation}`).emit('interpreter-update', request); res.json({ request, consultation }); } catch (error) { next(error); } });

router.post('/translation', protect, async (req, res) => { const { text = '', sourceLanguage = 'en', targetLanguage = 'en' } = req.body; if (!text.trim()) return res.status(400).json({ message: 'Text is required.' }); try { const translatedText = await translateText(text, sourceLanguage, targetLanguage); res.json({ translatedText, provider: 'mymemory', targetLanguage: languageNames[targetLanguage] ? targetLanguage : 'en' }); } catch (error) { res.status(502).json({ message: `Translation failed: ${error.message}` }); } });
module.exports = router;
