const express = require('express');
const Pet = require('../models/Pet');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Get all pets with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {};
    
    if (req.query.species) filter.species = req.query.species;
    if (req.query.size) filter.size = req.query.size;
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.status) filter.status = req.query.status;
    else filter.status = 'available'; // Default to available pets

    // Age range filter
    if (req.query.minAge || req.query.maxAge) {
      filter.age = {};
      if (req.query.minAge) filter.age.$gte = parseInt(req.query.minAge);
      if (req.query.maxAge) filter.age.$lte = parseInt(req.query.maxAge);
    }

    // Search by name or breed
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { breed: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const pets = await Pet.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Pet.countDocuments(filter);

    res.json({
      pets,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured pets
router.get('/featured', async (req, res) => {
  try {
    const pets = await Pet.find({ featured: true, status: 'available' })
      .limit(8)
      .sort({ createdAt: -1 });

    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single pet
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create pet (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const pet = new Pet(req.body);
    await pet.save();
    res.status(201).json({
      message: 'Pet created successfully',
      pet
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update pet (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    res.json({
      message: 'Pet updated successfully',
      pet
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete pet (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get similar pets
router.get('/:id/similar', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const similarPets = await Pet.find({
      _id: { $ne: pet._id },
      species: pet.species,
      status: 'available'
    }).limit(4);

    res.json(similarPets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;