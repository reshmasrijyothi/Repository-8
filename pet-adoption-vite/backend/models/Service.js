const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['grooming', 'veterinary', 'training', 'boarding', 'daycare'] },
  description: String,
  price: { type: Number, required: true },
  duration: Number, // in minutes
  images: [String],
  provider: {
    name: String,
    qualification: String,
    experience: String,
    rating: Number
  },
  availability: {
    days: [String],
    timeSlots: [String]
  },
  active: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);