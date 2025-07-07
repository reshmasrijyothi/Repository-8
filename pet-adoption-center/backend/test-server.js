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

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test routes
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Pet Adoption Center API is running!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

app.get('/api/pets', (req, res) => {
  const samplePets = [
    {
      id: '1',
      name: 'Buddy',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 3,
      adoptionFee: 200
    }
  ];
  res.json({ pets: samplePets });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
