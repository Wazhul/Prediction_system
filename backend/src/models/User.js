const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true, required: true },
  role: { type: String, enum: ['student', 'institution', 'donor', 'admin'], required: true },
  password: { type: String, required: true },
  did: { type: String }, // Self-Sovereign Identity
  profile: {
    name: String,
    email: String,
    gpa: { type: Number }, // For students
    income: { type: Number } // For eligibility
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);