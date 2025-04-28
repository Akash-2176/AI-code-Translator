const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sourceLang: String,
  targetLang: String,
  inputCode: String,
  outputCode: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
