const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// POST /api/candidates
// Add new candidate (admin only)
router.post('/', async (req, res) => {
  const { name, description, photoUrl } = req.body;

  if (!name || !description || !photoUrl) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newCandidate = new Candidate({
      name,
      description,
      photoUrl,
    });

    await newCandidate.save();

    res.status(201).json({
      message: 'Candidate created successfully',
      candidate: {
        id: newCandidate._id,
        name: newCandidate.name,
        description: newCandidate.description,
        photoUrl: newCandidate.photoUrl,
        votes: newCandidate.votes,
      },
    });
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();

    const formattedCandidates = candidates.map((candidate) => ({
      id: candidate._id,
      name: candidate.name,
      description: candidate.description,
      photoUrl: candidate.photoUrl,
      votes: candidate.votes,
    }));

    res.json({ candidates: formattedCandidates });
  } catch (error) {
    console.error('Get all candidates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id', async (req, res) => {
  const { name, description, photoUrl } = req.body;

  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    candidate.name = name || candidate.name;
    candidate.description = description || candidate.description;
    candidate.photoUrl = photoUrl || candidate.photoUrl;

    await candidate.save();

    res.json({
      message: 'Candidate updated successfully',
      candidate: {
        id: candidate._id,
        name: candidate.name,
        description: candidate.description,
        photoUrl: candidate.photoUrl,
        votes: candidate.votes,
      },
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
