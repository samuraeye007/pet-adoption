// backend/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authenticateUser = require('../middlewares/authMiddlewares');

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://ssachdeva:Namhe%40123@cluster0.xbe9e.mongodb.net/miaudote?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const { User, Pet } = require('./models.js');
const app = express();


// Add other API endpoints for user authentication, pet registration, etc.


const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());


const secretKey = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateToken = (email) => {
  // Replace 'YOUR_SECRET_KEY' with your actual secret key
  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
  return token;
};


// Function to generate a unique ID
const generateUniqueId = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substr(2);
  return dateString + randomness;
  // ...
};


app.post('/signup', async (req, res) => {
  // Retrieve user data from request body
  const { name, email, aadhar, cellphone, password } = req.body;

  // Create a new user document
  const newUser = new User({ name, email, aadhar, cellphone, password });

  try {
    // Save the new user document to the users collection
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = generateToken(user.email);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/pets', async (req, res) => {
  try {
    const lastPet = await Pet.findOne({}, {}, { sort: { 'id': -1 } });

    // Calculate the new ID
    let newId = 1;
    if (lastPet) {
      newId = lastPet.id + 1;
    }
    const { name, photo, category, description, characteristics, pin, city, state } = req.body;

    // Create a new pet document
    const newPet = new Pet({
      id: newId,
      name,
      photo,
      category,
      description,
      characteristics,
      pin,
      city,
      state,
      available: true,
      ownerEmail: req.user.email,
      ownerCellphone: req.user.cellphone || '1234567890',
      registeredAt: Date.now(),
    });

    // Save the new pet document to the pets collection
    await newPet.save();

    res.status(201).json(newPet);
  } catch (error) {
    console.error('Error creating a new pet:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/my-account', authenticateUser(secretKey), async (req, res) => {
  try {
    const { email } = req.user;
    
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve pet information for the user
    const userPets = await Pet.find({ ownerEmail: user.email });

    res.status(200).json({ ...user.toJSON(), pets: userPets });
  } catch (error) {
    console.error('Error fetching user account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/pets/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Received delete request for pet ID:', id);
  
  try {
    // Query the database for the pet with the given ID
    const deletedPet = await Pet.deleteOne({ id: id });
    console.log('Deleted pet:', deletedPet); // Log the result
    // Rest of the deletion logic
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/pets', async (req, res) => {
  try {
    // Retrieve all pets from the pets collection
    const pets = await Pet.find();

    res.status(200).json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/pets/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the pet by ID
    const pet = await Pet.findOne({ id: id });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error('Error fetching pet by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.patch('/pets/:id', async (req, res) => {
  const { id } = req.params;
  const { available } = req.body;

  try {
    // Update the availability of the pet by ID
    await Pet.updateOne({ id: id }, { available });

    res.status(200).json({ message: 'Pet availability updated successfully' });
  } catch (error) {
    console.error('Error updating pet availability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
 });