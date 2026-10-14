const mongoose = require('mongoose');
module.exports = mongoose.model('InterpreterProfile', new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, languages: { type: [String], default: ['en'] }, isAvailable: { type: Boolean, default: true } }, { timestamps: true }));
