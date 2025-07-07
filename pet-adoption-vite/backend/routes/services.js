const express = require('express');
const Service = require('../models/Service');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    const filter = { active: true };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const services = await Service.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Service.countDocuments(filter);
    
    res.json({
      success: true,
      services,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/services/featured
// @desc    Get featured services
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const services = await Service.find({ featured: true, active: true })
      .sort({ createdAt: -1 })
      .limit(6);
    
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/services/categories
// @desc    Get service categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/services
// @desc    Create service (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;