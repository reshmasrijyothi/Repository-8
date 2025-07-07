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