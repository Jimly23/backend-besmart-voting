const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'voter'], required: true },
  username: { type: String }, // for admin
  nim: { type: String },      // for voter
  passwordHash: { type: String, required: true },
  hasVoted: { type: Boolean, default: false },
  votedCandidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', default: null }
});

module.exports = mongoose.model('User', userSchema);
