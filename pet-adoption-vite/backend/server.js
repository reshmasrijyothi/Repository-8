const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory database for demo
const database = {
  users: [
    {
      _id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@petcenter.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5h9RK8zA6W', // admin123
      phone: '555-0001',
      role: 'admin'
    },
    {
      _id: '2',
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@petcenter.com',
      password: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // user123
      phone: '555-0002',
      role: 'user'
    }
  ],
  pets: [
    {
      _id: '1',
      name: 'Buddy',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'male',
      size: 'large',
      color: 'Golden',
      description: 'Friendly and energetic dog looking for a loving family.',
      photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=500'],
      adoptionFee: 200,
      adoptionStatus: 'available',
      healthInfo: { vaccinated: true, spayedNeutered: true },
      temperament: ['friendly', 'energetic', 'loyal'],
      goodWith: { children: true, otherPets: true, strangers: true },
      shelter: { name: 'Happy Paws Shelter', location: 'Downtown', contact: '555-0100' },
      featured: true
    },
    {
      _id: '2',
      name: 'Luna',
      species: 'cat',
      breed: 'Maine Coon',
      age: 2,
      gender: 'female',
      size: 'medium',
      color: 'Gray and White',
      description: 'Beautiful Maine Coon with a sweet personality.',
      photos: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500'],
      adoptionFee: 150,
      adoptionStatus: 'available',
      healthInfo: { vaccinated: true, spayedNeutered: true },
      temperament: ['calm', 'affectionate'],
      goodWith: { children: true, otherPets: false, strangers: false },
      shelter: { name: 'Whiskers Cat Rescue', location: 'Uptown', contact: '555-0101' },
      featured: true
    },
    {
      _id: '3',
      name: 'Charlie',
      species: 'dog',
      breed: 'Labrador Mix',
      age: 1,
      gender: 'male',
      size: 'medium',
      color: 'Black',
      description: 'Young energetic pup who loves to play fetch.',
      photos: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
      adoptionFee: 175,
      adoptionStatus: 'available',
      healthInfo: { vaccinated: true, spayedNeutered: false },
      temperament: ['playful', 'energetic'],
      goodWith: { children: true, otherPets: true, strangers: true },
      shelter: { name: 'Happy Paws Shelter', location: 'Downtown', contact: '555-0100' },
      featured: false
    }
  ],
  services: [
    {
      _id: '1',
      name: 'Basic Grooming Package',
      category: 'grooming',
      description: 'Complete grooming service including bath, nail trim, and brushing.',
      price: 50,
      duration: 90,
      provider: { name: 'Sarah Johnson', qualification: 'Certified Pet Groomer', rating: 4.8 },
      active: true,
      featured: true
    },
    {
      _id: '2',
      name: 'Veterinary Health Checkup',
      category: 'veterinary',
      description: 'Comprehensive health examination with licensed veterinarian.',
      price: 85,
      duration: 45,
      provider: { name: 'Dr. Michael Chen', qualification: 'Doctor of Veterinary Medicine', rating: 4.9 },
      active: true,
      featured: false
    },
    {
      _id: '3',
      name: 'Basic Obedience Training',
      category: 'training',
      description: 'Individual training session for basic commands.',
      price: 75,
      duration: 60,
      provider: { name: 'Lisa Rodriguez', qualification: 'Certified Dog Trainer', rating: 4.7 },
      active: true,
      featured: false
    }
  ]
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '30d' });
};

// Auth middleware
const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    req.user = database.users.find(user => user._id === decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = database.users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = generateToken(user._id);
    
    res.json({
      success: true,
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
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    
    const userExists = database.users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      _id: String(database.users.length + 1),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: 'user'
    };
    
    database.users.push(newUser);
    const token = generateToken(newUser._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/auth/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Pet routes
app.get('/api/pets', (req, res) => {
  try {
    const { species, size, gender, search, page = 1, limit = 12 } = req.query;
    
    let filteredPets = database.pets.filter(pet => {
      if (species && pet.species !== species) return false;
      if (size && pet.size !== size) return false;
      if (gender && pet.gender !== gender) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        return pet.name.toLowerCase().includes(searchLower) ||
               pet.breed.toLowerCase().includes(searchLower) ||
               pet.description.toLowerCase().includes(searchLower);
      }
      return true;
    });
    
    // Sort by featured first, then by ID
    filteredPets.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPets = filteredPets.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      pets: paginatedPets,
      total: filteredPets.length,
      pages: Math.ceil(filteredPets.length / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/pets/featured', (req, res) => {
  try {
    const featuredPets = database.pets.filter(pet => pet.featured && pet.adoptionStatus === 'available');
    res.json({ success: true, pets: featuredPets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/pets/:id', (req, res) => {
  try {
    const pet = database.pets.find(p => p._id === req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    res.json({ success: true, pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Service routes
app.get('/api/services', (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    let filteredServices = database.services.filter(service => {
      if (!service.active) return false;
      if (category && service.category !== category) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        return service.name.toLowerCase().includes(searchLower) ||
               service.description.toLowerCase().includes(searchLower);
      }
      return true;
    });
    
    // Sort by featured first
    filteredServices.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedServices = filteredServices.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      services: paginatedServices,
      total: filteredServices.length,
      pages: Math.ceil(filteredServices.length / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/services/featured', (req, res) => {
  try {
    const featuredServices = database.services.filter(service => service.featured && service.active);
    res.json({ success: true, services: featuredServices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Pet Adoption API is running!', 
    timestamp: new Date(),
    database: 'In-memory JSON database',
    users: database.users.length,
    pets: database.pets.length,
    services: database.services.length
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🎉 Demo accounts: admin@petcenter.com/admin123, user@petcenter.com/user123`);
  console.log(`📊 Database: ${database.users.length} users, ${database.pets.length} pets, ${database.services.length} services`);
});