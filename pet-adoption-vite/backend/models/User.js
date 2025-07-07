const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  
  // Address Information
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    }
  },
  
  // Profile Information
  avatar: {
    type: String, // URL to profile image
    default: null
  },
  dateOfBirth: {
    type: Date
  },
  occupation: {
    type: String,
    trim: true
  },
  
  // User Role and Permissions
  role: {
    type: String,
    enum: ['user', 'admin', 'shelter', 'volunteer'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Pet Adoption History
  adoptionHistory: [{
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet'
    },
    adoptionDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending'
    }
  }],
  
  // Service Booking History
  serviceHistory: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    bookingDate: Date,
    serviceDate: Date,
    status: {
      type: String,
      enum: ['booked', 'completed', 'cancelled'],
      default: 'booked'
    }
  }],
  
  // Preferences
  preferences: {
    preferredPetTypes: [{
      type: String,
      enum: ['dog', 'cat', 'bird', 'rabbit', 'fish', 'other']
    }],
    preferredPetSizes: [{
      type: String,
      enum: ['small', 'medium', 'large']
    }],
    hasExperience: {
      type: Boolean,
      default: false
    },
    hasYard: {
      type: Boolean,
      default: false
    },
    hasOtherPets: {
      type: Boolean,
      default: false
    },
    hasChildren: {
      type: Boolean,
      default: false
    }
  },
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  
  // Account Management
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for adoption count
userSchema.virtual('adoptionCount').get(function() {
  return this.adoptionHistory.filter(adoption => 
    adoption.status === 'completed'
  ).length;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update lastLogin
userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.lastLogin = new Date();
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to check if user can adopt
userSchema.methods.canAdopt = function() {
  const pendingAdoptions = this.adoptionHistory.filter(
    adoption => adoption.status === 'pending'
  ).length;
  
  return this.isVerified && this.isActive && pendingAdoptions === 0;
};

// Instance method to get user's public profile
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    avatar: this.avatar,
    role: this.role,
    adoptionCount: this.adoptionCount,
    joinDate: this.createdAt,
    isVerified: this.isVerified
  };
};

// Static method to find users by role
userSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Static method to get adoption statistics
userSchema.statics.getAdoptionStats = async function() {
  const stats = await this.aggregate([
    { $match: { isActive: true } },
    { $unwind: '$adoptionHistory' },
    { $match: { 'adoptionHistory.status': 'completed' } },
    {
      $group: {
        _id: null,
        totalAdoptions: { $sum: 1 },
        adopters: { $addToSet: '$_id' }
      }
    },
    {
      $project: {
        totalAdoptions: 1,
        totalAdopters: { $size: '$adopters' }
      }
    }
  ]);
  
  return stats[0] || { totalAdoptions: 0, totalAdopters: 0 };
};

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationExpires;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);