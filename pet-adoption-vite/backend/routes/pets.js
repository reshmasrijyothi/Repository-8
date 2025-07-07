const express = require('express');
const Pet = require('../models/Pet');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/pets
// @desc    Get all pets
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { species, size, gender, search, page = 1, limit = 12 } = req.query;
    
    const filter = {};
    if (species) filter.species = species;
    if (size) filter.size = size;
    if (gender) filter.gender = gender;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const pets = await Pet.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Pet.countDocuments(filter);
    
    res.json({
      success: true,
      pets,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/pets/featured
// @desc    Get featured pets
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const pets = await Pet.find({ featured: true, adoptionStatus: 'available' })
      .sort({ createdAt: -1 })
      .limit(6);
    
    res.json({ success: true, pets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/pets/:id
// @desc    Get single pet
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    res.json({ success: true, pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/pets
// @desc    Create pet (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json({ success: true, pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;