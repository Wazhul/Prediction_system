const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campaignId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  mlPrediction: { type: Boolean },
  submittedAt: { type: Date, default: Date.now },
  documents: [{ type: String }] // IPFS hashes
});

module.exports = mongoose.model('Application', applicationSchema);