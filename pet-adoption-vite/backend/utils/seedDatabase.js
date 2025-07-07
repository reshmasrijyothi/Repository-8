const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Pet = require('../models/Pet');
const Service = require('../models/Service');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-adoption');
    
    // Clear existing data
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Service.deleteMany({});
    
    // Create users
    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('user123', 12);
    
    await User.create([
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@petcenter.com',
        password: adminPassword,
        phone: '555-0001',
        role: 'admin'
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@petcenter.com',
        password: userPassword,
        phone: '555-0002',
        role: 'user'
      }
    ]);
    
    // Create pets
    await Pet.create([
      {
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
        healthInfo: { vaccinated: true, spayedNeutered: true },
        temperament: ['friendly', 'energetic', 'loyal'],
        goodWith: { children: true, otherPets: true, strangers: true },
        shelter: { name: 'Happy Paws Shelter', location: 'Downtown', contact: '555-0100' },
        featured: true
      },
      {
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
        healthInfo: { vaccinated: true, spayedNeutered: true },
        temperament: ['calm', 'affectionate'],
        goodWith: { children: true, otherPets: false, strangers: false },
        shelter: { name: 'Whiskers Cat Rescue', location: 'Uptown', contact: '555-0101' },
        featured: true
      }
    ]);
    
    // Create services
    await Service.create([
      {
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
        name: 'Veterinary Health Checkup',
        category: 'veterinary',
        description: 'Comprehensive health examination with licensed veterinarian.',
        price: 85,
        duration: 45,
        provider: { name: 'Dr. Michael Chen', qualification: 'Doctor of Veterinary Medicine', rating: 4.9 },
        active: true
      },
      {
        name: 'Basic Obedience Training',
        category: 'training',
        description: 'Individual training session for basic commands.',
        price: 75,
        duration: 60,
        provider: { name: 'Lisa Rodriguez', qualification: 'Certified Dog Trainer', rating: 4.7 },
        active: true
      }
    ]);
    
    console.log('✅ Database seeded successfully!');
    console.log('📊 Created 2 users, 2 pets, 3 services');
    console.log('🎉 Demo accounts: admin@petcenter.com/admin123, user@petcenter.com/user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();