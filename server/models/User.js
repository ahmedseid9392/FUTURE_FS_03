import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema Definition - No duplicate indexes
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // This creates the index - DO NOT add another index below
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'Ethiopia'
    }
  },
  profileImage: {
    url: String,
    publicId: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
   googleId: {
    type: String,
    sparse: true,
    unique: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.emailVerificationToken;
  delete userObject.__v;
  return userObject;
};

// Virtual: Full address
userSchema.virtual('fullAddress').get(function() {
  if (!this.address.street) return '';
  const parts = [
    this.address.street,
    this.address.city,
    this.address.state,
    this.address.zipCode,
    this.address.country
  ].filter(part => part && part.trim());
  return parts.join(', ');
});

// Virtual: Initials
userSchema.virtual('initials').get(function() {
  return this.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.emailExists = async function(email) {
  const user = await this.findOne({ email: email.toLowerCase() });
  return !!user;
};

userSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Only create indexes for non-unique fields
// DO NOT create index for email since unique: true already creates it
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1, isActive: 1, createdAt: -1 });

const User = mongoose.model('User', userSchema);

export default User;