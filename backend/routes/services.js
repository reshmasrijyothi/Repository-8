const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// @route   GET /api/services
// @desc    Get all services with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      priceMin,
      priceMax,
      available,
      search,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = parseFloat(priceMin);
      if (priceMax) filter.price.$lte = parseFloat(priceMax);
    }

    if (available === 'true') {
      filter.available = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const services = await Service.find(filter)
      .populate('provider', 'firstName lastName email phone')
      .sort({ featured: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Service.countDocuments(filter);

    res.json({
      success: true,
      services,
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit)),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching services',
      error: error.message
    });
  }
});

// @route   GET /api/services/featured
// @desc    Get featured services
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const services = await Service.find({ 
      featured: true, 
      available: true 
    })
      .populate('provider', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Error fetching featured services:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured services',
      error: error.message
    });
  }
});

// @route   GET /api/services/categories
// @desc    Get all service categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching service categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: error.message
    });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'firstName lastName email phone experience specializations');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching service',
      error: error.message
    });
  }
});

// @route   POST /api/services
// @desc    Create new service (Admin only)
// @access  Private/Admin
router.post(
  '/',
  protect,
  [
    body('name').notEmpty().withMessage('Service name is required'),
    body('description').notEmpty().withMessage('Service description is required'),
    body('category').notEmpty().withMessage('Service category is required'),
    body('price').isNumeric().withMessage('Valid price is required'),
    body('duration').isNumeric().withMessage('Valid duration is required')
  ],
  async (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create services'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    try {
      const serviceData = {
        ...req.body,
        provider: req.user._id
      };

      const service = new Service(serviceData);
      await service.save();

      await service.populate('provider', 'firstName lastName email phone');

      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        service
      });
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating service',
        error: error.message
      });
    }
  }
);

// @route   PUT /api/services/:id
// @desc    Update service (Admin only)
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update services'
    });
  }

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('provider', 'firstName lastName email phone');

    res.json({
      success: true,
      message: 'Service updated successfully',
      service: updatedService
    });
  } catch (error) {
    console.error('Error updating service:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating service',
      error: error.message
    });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete service (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete services'
    });
  }

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting service',
      error: error.message
    });
  }
});

module.exports = router;