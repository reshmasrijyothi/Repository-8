const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true, enum: ['dog', 'cat', 'bird', 'rabbit', 'other'] },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female'] },
  size: { type: String, enum: ['small', 'medium', 'large'] },
  color: String,
  description: String,
  photos: [String],
  adoptionStatus: { type: String, enum: ['available', 'pending', 'adopted'], default: 'available' },
  adoptionFee: { type: Number, default: 0 },
  healthInfo: {
    vaccinated: Boolean,
    spayedNeutered: Boolean,
    medicalHistory: String
  },
  temperament: [String],
  goodWith: {
    children: Boolean,
    otherPets: Boolean,
    strangers: Boolean
  },
  shelter: {
    name: String,
    location: String,
    contact: String
  },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

petSchema.index({ species: 1, adoptionStatus: 1 });
petSchema.index({ featured: -1, createdAt: -1 });

module.exports = mongoose.model('Pet', petSchema);