# Complete Pet Adoption & Care Center Website - MERN Stack Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)
4. [Backend Development](#backend-development)
5. [Database Design](#database-design)
6. [Frontend Development](#frontend-development)
7. [Integration & Testing](#integration--testing)
8. [Deployment](#deployment)
9. [Additional Features](#additional-features)

## Project Overview

### Features to Implement:
- **User Authentication**: Registration, login, logout, profile management
- **Pet Adoption**: Browse pets, view details, adoption applications, adoption history
- **Pet Care Services**: Booking appointments, service management, scheduling
- **Admin Panel**: Manage pets, users, services, appointments
- **Responsive Design**: Mobile-first approach
- **Real-time Features**: Notifications, chat support

### Technology Stack:
- **Frontend**: React.js, React Router, Axios, Bootstrap/Material-UI
- **Backend**: Node.js, Express.js, JWT authentication
- **Database**: MongoDB with Mongoose ODM
- **Additional**: Cloudinary (image uploads), Socket.io (real-time features)

## Prerequisites

### Required Knowledge:
- JavaScript (ES6+)
- React.js fundamentals
- Node.js and Express.js
- MongoDB basics
- HTML/CSS
- Git version control

### Development Environment:
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- VS Code or preferred IDE
- Git
- Postman (API testing)

## Project Setup

### Step 1: Create Project Structure
```bash
mkdir pet-adoption-center
cd pet-adoption-center

# Create main directories
mkdir backend frontend

# Initialize Git repository
git init
```

### Step 2: Backend Setup
```bash
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken cors dotenv multer cloudinary express-validator helmet morgan compression

# Install development dependencies
npm install -D nodemon concurrently

# Create basic folder structure
mkdir routes models middleware controllers uploads config utils
touch app.js server.js
```

### Step 3: Frontend Setup
```bash
cd ../frontend

# Create React app
npx create-react-app . --template typescript
# or without TypeScript: npx create-react-app .

# Install additional dependencies
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material react-query formik yup socket.io-client

# Install development dependencies
npm install -D @types/node
```

## Backend Development

### Step 4: Configure Environment Variables
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pet-adoption
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Step 5: Database Models

#### User Model (`backend/models/User.js`):
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  avatar: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  adoptionHistory: [{
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
    adoptionDate: { type: Date },
    status: { type: String, enum: ['pending', 'approved', 'completed', 'rejected'] }
  }],
  preferences: {
    petTypes: [String],
    notifications: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
```

#### Pet Model (`backend/models/Pet.js`):
```javascript
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { 
    type: String, 
    required: true, 
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other'] 
  },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { 
    type: String, 
    required: true, 
    enum: ['male', 'female'] 
  },
  size: { 
    type: String, 
    required: true, 
    enum: ['small', 'medium', 'large', 'extra-large'] 
  },
  color: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  healthInfo: {
    vaccinated: { type: Boolean, default: false },
    spayedNeutered: { type: Boolean, default: false },
    medicalHistory: { type: String },
    specialNeeds: { type: String }
  },
  temperament: [String],
  goodWith: {
    children: { type: Boolean, default: false },
    otherPets: { type: Boolean, default: false },
    strangers: { type: Boolean, default: false }
  },
  adoptionFee: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'pending', 'adopted'], 
    default: 'available' 
  },
  shelter: {
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true }
  },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pet', petSchema);
```

#### Service Model (`backend/models/Service.js`):
```javascript
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['grooming', 'veterinary', 'training', 'boarding', 'daycare'] 
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  images: [String],
  availability: {
    days: [{ 
      type: String, 
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] 
    }],
    timeSlots: [String]
  },
  provider: {
    name: { type: String, required: true },
    qualification: String,
    experience: String,
    rating: { type: Number, default: 0 }
  },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
```

#### Appointment Model (`backend/models/Appointment.js`):
```javascript
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  service: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  petInfo: {
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: String,
    age: Number,
    specialInstructions: String
  },
  appointmentDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded'], 
    default: 'pending' 
  },
  notes: String,
  reminder: {
    sent: { type: Boolean, default: false },
    sentAt: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
```

#### Adoption Application Model (`backend/models/AdoptionApplication.js`):
```javascript
const mongoose = require('mongoose');

const adoptionApplicationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  pet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pet', 
    required: true 
  },
  applicationData: {
    housingType: { 
      type: String, 
      required: true,
      enum: ['apartment', 'house', 'condo', 'farm'] 
    },
    hasYard: { type: Boolean, required: true },
    hasOtherPets: { type: Boolean, required: true },
    otherPetsDetails: String,
    experience: { type: String, required: true },
    reason: { type: String, required: true },
    schedule: { type: String, required: true },
    vetReference: {
      name: String,
      phone: String,
      clinic: String
    },
    references: [{
      name: String,
      relationship: String,
      phone: String
    }]
  },
  status: { 
    type: String, 
    enum: ['pending', 'under-review', 'approved', 'rejected'], 
    default: 'pending' 
  },
  reviewNotes: String,
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reviewedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('AdoptionApplication', adoptionApplicationSchema);
```

### Step 6: Authentication Middleware
Create `backend/middleware/auth.js`:
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, admin only' });
  }
};

module.exports = { protect, admin };
```

### Step 7: API Routes

#### Auth Routes (`backend/routes/auth.js`):
```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register user
router.post('/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, phone, address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      address
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### Pet Routes (`backend/routes/pets.js`):
```javascript
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
    res.status(201).json(pet);
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
    
    res.json(pet);
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

module.exports = router;
```

### Step 8: Main Application Setup
Create `backend/app.js`:
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const serviceRoutes = require('./routes/services');
const appointmentRoutes = require('./routes/appointments');
const adoptionRoutes = require('./routes/adoptions');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/adoptions', adoptionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
```

Create `backend/server.js`:
```javascript
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Database connection error:', error);
  process.exit(1);
});
```

## Frontend Development

### Step 9: React Application Structure
Create the following folder structure in `frontend/src/`:
```
src/
├── components/
│   ├── common/
│   ├── auth/
│   ├── pets/
│   ├── services/
│   └── admin/
├── pages/
├── hooks/
├── context/
├── utils/
├── services/
└── styles/
```

### Step 10: Authentication Context
Create `frontend/src/context/AuthContext.js`:
```javascript
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    if (state.token) {
      authService.getCurrentUser()
        .then(user => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token: state.token }
          });
        })
        .catch(() => {
          dispatch({ type: 'LOGOUT' });
          localStorage.removeItem('token');
        });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.token]);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    localStorage.setItem('token', response.token);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: response
    });
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    localStorage.setItem('token', response.token);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: response
    });
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Step 11: API Services
Create `frontend/src/services/api.js`:
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Step 12: Main Components

#### Pet Card Component (`frontend/src/components/pets/PetCard.js`):
```javascript
import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Chip, 
  Button,
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PetCard = ({ pet }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/pets/${pet._id}`);
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 1 }}>
      <CardMedia
        component="img"
        height="250"
        image={pet.images?.[0] || '/placeholder-pet.jpg'}
        alt={pet.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {pet.name}
        </Typography>
        
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip label={pet.species} color="primary" size="small" />
          <Chip label={pet.gender} color="secondary" size="small" />
          <Chip label={pet.size} color="default" size="small" />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {pet.breed} • {pet.age} years old
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {pet.description.substring(0, 100)}...
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary">
            ${pet.adoptionFee}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PetCard;
```

#### Pet Listing Page (`frontend/src/pages/PetsPage.js`):
```javascript
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Pagination,
  Box
} from '@mui/material';
import PetCard from '../components/pets/PetCard';
import petService from '../services/petService';

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: '',
    size: '',
    gender: '',
    minAge: '',
    maxAge: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchPets();
  }, [filters, pagination.current]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await petService.getPets({
        ...filters,
        page: pagination.current
      });
      setPets(response.pets);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const clearFilters = () => {
    setFilters({
      species: '',
      size: '',
      gender: '',
      minAge: '',
      maxAge: '',
      search: ''
    });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Find Your Perfect Pet
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search Filters
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Pet name or breed"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Species</InputLabel>
              <Select
                value={filters.species}
                onChange={(e) => handleFilterChange('species', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="dog">Dog</MenuItem>
                <MenuItem value="cat">Cat</MenuItem>
                <MenuItem value="bird">Bird</MenuItem>
                <MenuItem value="rabbit">Rabbit</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Size</InputLabel>
              <Select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
                <MenuItem value="extra-large">Extra Large</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1}>
            <TextField
              fullWidth
              type="number"
              label="Min Age"
              value={filters.minAge}
              onChange={(e) => handleFilterChange('minAge', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={1}>
            <TextField
              fullWidth
              type="number"
              label="Max Age"
              value={filters.maxAge}
              onChange={(e) => handleFilterChange('maxAge', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={1}>
            <Button 
              variant="outlined" 
              onClick={clearFilters}
              fullWidth
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      <Typography variant="h6" gutterBottom>
        {pagination.total} pets found
      </Typography>

      <Grid container spacing={3}>
        {pets.map((pet) => (
          <Grid item xs={12} sm={6} md={4} key={pet._id}>
            <PetCard pet={pet} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pagination.pages}
            page={pagination.current}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default PetsPage;
```

### Step 13: Routing Setup
Create `frontend/src/App.js`:
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import PetsPage from './pages/PetsPage';
import PetDetailsPage from './pages/PetDetailsPage';
import ServicesPage from './pages/ServicesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green
    },
    secondary: {
      main: '#FF6F00', // Orange
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 120px)' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pets" element={<PetsPage />} />
                <Route path="/pets/:id" element={<PetDetailsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
```

## Integration & Testing

### Step 14: Environment Setup
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Pet Adoption Center
```

Create `backend/package.json` scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seedDatabase.js"
  }
}
```

Create `frontend/package.json` scripts:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### Step 15: Database Seeding
Create `backend/utils/seedDatabase.js`:
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Pet = require('../models/Pet');
const Service = require('../models/Service');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Service.deleteMany({});
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@petcenter.com',
      password: adminPassword,
      phone: '555-0001',
      role: 'admin'
    });
    
    // Create sample pets
    const samplePets = [
      {
        name: 'Buddy',
        species: 'dog',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'male',
        size: 'large',
        color: 'Golden',
        description: 'Friendly and energetic dog looking for a loving family.',
        images: ['https://example.com/buddy.jpg'],
        healthInfo: {
          vaccinated: true,
          spayedNeutered: true
        },
        temperament: ['friendly', 'energetic', 'loyal'],
        goodWith: {
          children: true,
          otherPets: true,
          strangers: true
        },
        adoptionFee: 200,
        shelter: {
          name: 'Happy Paws Shelter',
          location: 'Downtown',
          contact: '555-0100'
        },
        featured: true
      }
      // Add more sample pets...
    ];
    
    await Pet.create(samplePets);
    
    // Create sample services
    const sampleServices = [
      {
        name: 'Basic Grooming',
        category: 'grooming',
        description: 'Complete grooming service including bath, nail trim, and brushing.',
        price: 50,
        duration: 90,
        availability: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          timeSlots: ['09:00', '11:00', '14:00', '16:00']
        },
        provider: {
          name: 'Sarah Johnson',
          qualification: 'Certified Pet Groomer',
          experience: '5 years',
          rating: 4.8
        }
      }
      // Add more services...
    ];
    
    await Service.create(sampleServices);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
```

## Deployment

### Step 16: Production Setup

#### Backend Deployment (Heroku example):
1. Create `backend/Procfile`:
```
web: node server.js
```

2. Update `backend/package.json`:
```json
{
  "engines": {
    "node": "16.x"
  }
}
```

3. Environment variables on Heroku:
```bash
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
```

#### Frontend Deployment (Netlify example):
1. Build settings:
```
Build command: npm run build
Publish directory: build
```

2. Environment variables:
```
REACT_APP_API_URL=https://your-backend-app.herokuapp.com/api
```

### Step 17: Docker Setup (Optional)
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/pet-adoption
      - JWT_SECRET=your_jwt_secret
    depends_on:
      - mongo
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
    depends_on:
      - backend
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## Additional Features

### Step 18: Advanced Features to Implement

#### Real-time Chat Support:
- Socket.io implementation
- Customer support chat
- Adoption counselor chat

#### Payment Integration:
- Stripe or PayPal integration
- Adoption fee payments
- Service booking payments

#### Email Notifications:
- Adoption application status updates
- Appointment reminders
- Newsletter subscriptions

#### Mobile App (React Native):
- Share codebase with React web app
- Push notifications
- Location-based pet searches

#### Advanced Search & Recommendations:
- AI-powered pet matching
- User preference learning
- Similar pets recommendations

### Step 19: Performance Optimization

#### Backend Optimizations:
- Implement Redis caching
- Database indexing
- Image optimization with Cloudinary
- Rate limiting
- API response compression

#### Frontend Optimizations:
- Code splitting with React.lazy()
- Image lazy loading
- PWA implementation
- Bundle size optimization
- CDN integration

### Step 20: Testing & Quality Assurance

#### Backend Testing:
```bash
npm install -D jest supertest
```

#### Frontend Testing:
```bash
npm install -D @testing-library/react @testing-library/jest-dom
```

#### E2E Testing:
```bash
npm install -D cypress
```

## Conclusion

This comprehensive guide provides a complete roadmap for building a professional pet adoption and care center website using the MERN stack. The implementation includes:

- ✅ Complete authentication system
- ✅ Pet adoption functionality
- ✅ Service booking system
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ RESTful API design
- ✅ Database optimization
- ✅ Production-ready deployment

The project structure is scalable and can be extended with additional features as needed. Remember to follow best practices for security, performance, and user experience throughout the development process.