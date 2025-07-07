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

// Index for search functionality
petSchema.index({ name: 'text', breed: 'text', description: 'text' });

module.exports = mongoose.model('Pet', petSchema);