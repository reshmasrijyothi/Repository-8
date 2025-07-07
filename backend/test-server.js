const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test routes (without database)
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Pet Adoption Center API is running!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    version: '1.0.0'
  });
});

// Sample pets endpoint (static data for testing)
app.get('/api/pets', (req, res) => {
  const samplePets = [
    {
      id: '1',
      name: 'Buddy',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'male',
      size: 'large',
      description: 'Friendly and energetic Golden Retriever',
      adoptionFee: 200,
      status: 'available'
    },
    {
      id: '2',
      name: 'Luna',
      species: 'cat',
      breed: 'Maine Coon',
      age: 2,
      gender: 'female',
      size: 'medium',
      description: 'Beautiful Maine Coon with sweet personality',
      adoptionFee: 150,
      status: 'available'
    }
  ];

  res.json({
    pets: samplePets,
    pagination: {
      current: 1,
      pages: 1,
      total: 2
    }
  });
});

// Test auth endpoint
app.post('/api/auth/test', (req, res) => {
  res.json({
    message: 'Auth endpoint working',
    received: req.body
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🐕 Test pets: http://localhost:${PORT}/api/pets`);
  console.log('✅ Backend API is ready for testing!');
});