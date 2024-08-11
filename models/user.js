const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => /\S+@\S+\.\S+/.test(value), // Basic email validation
      message: 'Invalid email address',
    },
  },
  aadhar: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => /^\d{12}$/.test(value), // Aadhar number validation
      message: 'Invalid Aadhar number',
    },
  },
  cellphone: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^\d{10}$/.test(value), // Indian phone number validation
      message: 'Invalid phone number',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});
userSchema.index({ email: 1 });

// Create an index on the aadhar field
userSchema.index({ aadhar: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
