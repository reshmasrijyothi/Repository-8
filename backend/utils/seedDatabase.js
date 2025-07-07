const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Pet = require('../models/Pet');
const Service = require('../models/Service');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Service.deleteMany({});
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@petcenter.com',
      password: adminPassword,
      phone: '555-0001',
      role: 'admin',
      address: {
        street: '123 Admin St',
        city: 'Pet City',
        state: 'PC',
        zipCode: '12345'
      }
    });
    
    // Create regular user
    console.log('👤 Creating test user...');
    const userPassword = await bcrypt.hash('user123', 12);
    await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@petcenter.com',
      password: userPassword,
      phone: '555-0002',
      role: 'user',
      address: {
        street: '456 User Ave',
        city: 'Pet City',
        state: 'PC',
        zipCode: '12345'
      }
    });
    
    // Create sample pets
    console.log('🐕 Creating sample pets...');
    const samplePets = [
      {
        name: 'Buddy',
        species: 'dog',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'male',
        size: 'large',
        color: 'Golden',
        description: 'Buddy is a friendly and energetic Golden Retriever looking for a loving family. He loves playing fetch, going on walks, and cuddling with his humans. Great with children and other pets!',
        images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=500'],
        healthInfo: {
          vaccinated: true,
          spayedNeutered: true,
          medicalHistory: 'Up to date on all vaccinations',
          specialNeeds: 'None'
        },
        temperament: ['friendly', 'energetic', 'loyal', 'gentle'],
        goodWith: {
          children: true,
          otherPets: true,
          strangers: true
        },
        adoptionFee: 200,
        shelter: {
          name: 'Happy Paws Shelter',
          location: 'Downtown Pet City',
          contact: '555-0100'
        },
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
        description: 'Luna is a beautiful Maine Coon with a sweet personality. She loves sunny windowsills, interactive toys, and gentle pets. Perfect for a quiet home looking for a loving companion.',
        images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500'],
        healthInfo: {
          vaccinated: true,
          spayedNeutered: true,
          medicalHistory: 'Healthy with regular checkups',
          specialNeeds: 'None'
        },
        temperament: ['calm', 'affectionate', 'independent'],
        goodWith: {
          children: true,
          otherPets: false,
          strangers: false
        },
        adoptionFee: 150,
        shelter: {
          name: 'Whiskers Cat Rescue',
          location: 'Uptown Pet City',
          contact: '555-0101'
        },
        featured: true
      },
      {
        name: 'Max',
        species: 'dog',
        breed: 'Labrador Mix',
        age: 5,
        gender: 'male',
        size: 'large',
        color: 'Chocolate Brown',
        description: 'Max is a gentle giant with a heart of gold. This Labrador mix is well-trained, house-broken, and perfect for families. He enjoys long walks and is very obedient.',
        images: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500'],
        healthInfo: {
          vaccinated: true,
          spayedNeutered: true,
          medicalHistory: 'No major health issues',
          specialNeeds: 'Senior dog, needs regular exercise'
        },
        temperament: ['gentle', 'obedient', 'calm', 'loyal'],
        goodWith: {
          children: true,
          otherPets: true,
          strangers: true
        },
        adoptionFee: 175,
        shelter: {
          name: 'Happy Paws Shelter',
          location: 'Downtown Pet City',
          contact: '555-0100'
        },
        featured: false
      },
      {
        name: 'Bella',
        species: 'cat',
        breed: 'Siamese',
        age: 1,
        gender: 'female',
        size: 'small',
        color: 'Cream and Brown',
        description: 'Bella is a young and playful Siamese kitten. She\'s very social, loves attention, and would do well in an active household. She\'s curious about everything and loves to explore.',
        images: ['https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=500'],
        healthInfo: {
          vaccinated: true,
          spayedNeutered: true,
          medicalHistory: 'All kitten vaccinations completed',
          specialNeeds: 'None'
        },
        temperament: ['playful', 'social', 'curious', 'vocal'],
        goodWith: {
          children: true,
          otherPets: true,
          strangers: true
        },
        adoptionFee: 125,
        shelter: {
          name: 'Whiskers Cat Rescue',
          location: 'Uptown Pet City',
          contact: '555-0101'
        },
        featured: true
      }
    ];
    
    await Pet.create(samplePets);
    
    // Create sample services
    console.log('🛁 Creating sample services...');
    const sampleServices = [
      {
        name: 'Basic Grooming Package',
        category: 'grooming',
        description: 'Complete grooming service including bath, nail trim, ear cleaning, and brushing. Perfect for maintaining your pet\'s hygiene and appearance.',
        price: 50,
        duration: 90,
        images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
        availability: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          timeSlots: ['09:00', '11:00', '14:00', '16:00']
        },
        provider: {
          name: 'Sarah Johnson',
          qualification: 'Certified Pet Groomer',
          experience: '5 years',
          rating: 4.8
        },
        active: true
      },
      {
        name: 'Veterinary Health Checkup',
        category: 'veterinary',
        description: 'Comprehensive health examination including physical check, vaccination updates, and health consultation with our licensed veterinarian.',
        price: 85,
        duration: 45,
        images: ['https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500'],
        availability: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          timeSlots: ['09:00', '10:30', '14:00', '15:30']
        },
        provider: {
          name: 'Dr. Michael Chen',
          qualification: 'Doctor of Veterinary Medicine',
          experience: '10 years',
          rating: 4.9
        },
        active: true
      },
      {
        name: 'Basic Obedience Training',
        category: 'training',
        description: 'Individual training session focused on basic commands like sit, stay, come, and leash walking. Great for puppies and young dogs.',
        price: 75,
        duration: 60,
        images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500'],
        availability: {
          days: ['tuesday', 'thursday', 'saturday'],
          timeSlots: ['10:00', '11:30', '14:00', '15:30']
        },
        provider: {
          name: 'Lisa Rodriguez',
          qualification: 'Certified Dog Trainer',
          experience: '7 years',
          rating: 4.7
        },
        active: true
      }
    ];
    
    await Service.create(sampleServices);
    
    console.log('✅ Database seeded successfully!');
    console.log('📊 Created:');
    console.log('   - 2 users (admin@petcenter.com / admin123, user@petcenter.com / user123)');
    console.log('   - 4 pets');
    console.log('   - 3 services');
    console.log('🎉 Ready to start the application!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();