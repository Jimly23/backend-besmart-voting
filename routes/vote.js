const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Candidate = require('../models/Candidate');

// POST /api/vote
// Submit a vote
router.post('/', async (req, res) => {
  const { voterId, candidateId } = req.body;

  if (!voterId || !candidateId) {
    return res.status(400).json({ message: 'Voter ID and Candidate ID are required.' });
  }

  try {
    // 1. Find the voter
    const voter = await User.findById(voterId);
    if (!voter) return res.status(404).json({ message: 'Voter not found.' });

    if (voter.hasVoted) {
      return res.status(400).json({ message: 'Voter has already voted.' });
    }

    // 2. Find the candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });

    // 3. Update candidate vote count
    candidate.votes += 1;
    await candidate.save();

    // 4. Update voter status
    voter.hasVoted = true;
    voter.votedFor = candidateId; // Optional
    await voter.save();

    return res.json({ message: 'Vote submitted successfully.' });

  } catch (error) {
    console.error('Vote error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
