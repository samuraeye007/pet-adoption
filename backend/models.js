const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  aadhar: { type: String, unique: true },
  cellphone: String,
  password: String,
});

// Define pet schema
const petSchema = new mongoose.Schema({
  id: Number,
  name: String,
  photo: String,
  category: String,
  description: String,
  characteristics: String,
  pin: String,
  city: String,
  state: String,
  available: Boolean,
  ownerName: String,
  ownerEmail: String,
  ownerCellphone: String,
  registeredAt: Date,
});

// Create models
const User = mongoose.model('User', userSchema);
const Pet = mongoose.model('Pet', petSchema);

module.exports = { User, Pet };
