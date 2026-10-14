const mongoose = require('mongoose');
module.exports = mongoose.model('Message', new mongoose.Schema({ consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true }, sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, text: { type: String, required: true, trim: true }, language: { type: String, default: 'en' } }, { timestamps: true }));
