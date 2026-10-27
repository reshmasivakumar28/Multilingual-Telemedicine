const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDatabase = require('./config/database');
const apiRoutes = require('./routes/apiRoutes');
const Message = require('./models/Message');
const User = require('./models/User');
const Consultation = require('./models/Consultation');
const { translateText } = require('./services/translation');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' } });
app.set('io', io);
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Telemedicine API is healthy.', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api', apiRoutes);
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((error, req, res, next) => { console.error(error); res.status(500).json({ message: error.message || 'Something went wrong.' }); });

io.use(async (socket, next) => { try { const decoded = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET); const user = await User.findById(decoded.id); if (!user) return next(new Error('Unauthorized socket connection.')); socket.data.user = user; next(); } catch { next(new Error('Unauthorized socket connection.')); } });

io.on('connection', (socket) => {
  if (socket.data.user.role === 'interpreter') socket.join('interpreters');
  socket.on('join-consultation', async (consultationId) => { const consultation = await Consultation.findById(consultationId); if (!consultation) return socket.emit('chat-error', 'Consultation not found.'); const id = socket.data.user._id; const allowed = consultation.patient.equals(id) || consultation.doctor.equals(id) || consultation.interpreter?.equals(id); if (!allowed) return socket.emit('chat-error', 'You are not assigned to this consultation.'); socket.join(`consultation:${consultationId}`); socket.to(`consultation:${consultationId}`).emit('participant-joined'); });
  socket.on('chat-message', async (payload) => { try { const consultation = await Consultation.findById(payload.consultation).populate('patient doctor interpreter', 'preferredLanguage'); if (!consultation) return socket.emit('chat-error', 'Consultation not found.'); const senderId = socket.data.user._id.toString(); const message = await Message.create({ consultation: consultation._id, sender: socket.data.user._id, text: payload.text, language: payload.language || 'en' }); const baseMessage = { ...message.toObject(), sender: { name: socket.data.user.name, role: socket.data.user.role } }; const sockets = await io.in(`consultation:${payload.consultation}`).fetchSockets(); await Promise.all(sockets.map(async (recipient) => { const recipientId = recipient.data.user._id.toString(); if (recipientId === senderId) return recipient.emit('chat-message', baseMessage); const targetLanguage = recipient.data.user.preferredLanguage || 'en'; let text = payload.text; try { text = await translateText(payload.text, payload.language || 'en', targetLanguage); } catch (translationError) { recipient.emit('chat-error', `Message delivered in the original language: ${translationError.message}`); } recipient.emit('chat-message', { ...baseMessage, text, originalText: payload.text, translated: text !== payload.text, language: targetLanguage }); })); } catch (error) { console.error(error); socket.emit('chat-error', 'Message could not be sent.'); } });
  socket.on('webrtc-signal', ({ consultationId, signal }) => socket.to(`consultation:${consultationId}`).emit('webrtc-signal', signal));
});

async function start() { try { await connectDatabase(); server.listen(process.env.PORT || 5000, () => console.log('Server running on port 5000')); } catch (error) { console.error(`Unable to start server: ${error.message}`); process.exit(1); } }
start();
      