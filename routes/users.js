const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /api/users/voter
// Add a new admin
router.post('/admin', async (req, res) => {
  const { name, nim, password } = req.body;

  if (!name || !nim || !password) {
    return res.status(400).json({ message: 'Name, NIM, and password are required.' });
  }

  try {
    const existingVoter = await User.findOne({ nim });
    if (existingVoter) {
      return res.status(409).json({ message: 'Admin with this NIM already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newVoter = new User({
      name,
      nim,
      passwordHash,
      role: 'admin',
    });

    await newVoter.save();

    res.status(201).json({
      message: 'Admin created successfully',
      voter: {
        id: newVoter._id,
        name: newVoter.name,
        nim: newVoter.nim,
        role: newVoter.role,
        hasVoted: newVoter.hasVoted,
      },
    });
  } catch (error) {
    console.error('Error creating voter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new voter
router.post('/', async (req, res) => {
  const { name, nim, password } = req.body;

  if (!name || !nim || !password) {
    return res.status(400).json({ message: 'Name, NIM, and password are required.' });
  }

  try {
    const existingVoter = await User.findOne({ nim });
    if (existingVoter) {
      return res.status(409).json({ message: 'Voter with this NIM already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newVoter = new User({
      name,
      nim,
      passwordHash,
      role: 'voter',
    });

    await newVoter.save();

    res.status(201).json({
      message: 'Voter created successfully',
      voter: {
        id: newVoter._id,
        name: newVoter.name,
        nim: newVoter.nim,
        role: newVoter.role,
        hasVoted: newVoter.hasVoted,
      },
    });
  } catch (error) {
    console.error('Error creating voter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/voters
// Get all voters
router.get('/', async (req, res) => {
  try {
    const voters = await User.find({ role: 'voter' });

    const formattedVoters = voters.map((voter) => ({
      id: voter._id,
      name: voter.name,
      nim: voter.nim,
      role: voter.role,
      hasVoted: voter.hasVoted,
    }));

    res.json({ voters: formattedVoters });
  } catch (error) {
    console.error('Error fetching voters:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/voter/:id
// Get voter by ID
router.get('/:id', async (req, res) => {
  try {
    const voter = await User.findOne({ _id: req.params.id, role: 'voter' });
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    res.json({
      id: voter._id,
      name: voter.name,
      nim: voter.nim,
      role: voter.role,
      hasVoted: voter.hasVoted,
    });
  } catch (error) {
    console.error('Error fetching voter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/voter/:id
// Update voter data (name, nim, password)
router.put('/:id', async (req, res) => {
  const { name, nim, password } = req.body;

  try {
    const voter = await User.findOne({ _id: req.params.id, role: 'voter' });
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    if (name) voter.name = name;
    if (nim) voter.nim = nim;

    if (password) {
      voter.passwordHash = await bcrypt.hash(password, 10);
    }

    await voter.save();

    res.json({
      message: 'Voter updated successfully',
      voter: {
        id: voter._id,
        name: voter.name,
        nim: voter.nim,
        role: voter.role,
        hasVoted: voter.hasVoted,
      },
    });
  } catch (error) {
    console.error('Error updating voter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/voter/:id
// Delete voter by ID
router.delete('/:id', async (req, res) => {
  try {
    const voter = await User.findOneAndDelete({ _id: req.params.id, role: 'voter' });
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    res.json({ message: 'Voter deleted successfully' });
  } catch (error) {
    console.error('Error deleting voter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
