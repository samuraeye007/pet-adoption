const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value), // URL validation
      message: 'Invalid photo URL',
    },
  },
  category: {
    type: String,
    enum: ['Cachorro', 'Gato'], // Assuming you have these categories
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  characteristics: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^\d{6}$/.test(value), // CEP validation
      message: 'Invalid PIN',
    },
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
    enum: [
        "Andhra Pradesh (AP)",
        "Arunachal Pradesh (AR)",
        "Assam (AS)",
        "Bihar (BR)",
        "Chhattisgarh (CG)",
        "Goa (GA)",
        "Gujarat (GJ)",
        "Haryana (HR)",
        "Himachal Pradesh (HP)",
        "Jharkhand (JH)",
        "Karnataka (KA)",
        "Kerala (KL)",
        "Madhya Pradesh (MP)",
        "Maharashtra (MH)",
        "Manipur (MN)",
        "Meghalaya (ML)",
        "Mizoram (MZ)",
        "Nagaland (NL)",
        "Odisha (OD)",
        "Punjab (PB)",
        "Rajasthan (RJ)",
        "Sikkim (SK)",
        "Tamil Nadu (TN)",
        "Telangana (TG)",
        "Tripura (TR)",
        "Uttar Pradesh (UP)",
        "Uttarakhand (UK)",
        "West Bengal (WB)",
        "Andaman and Nicobar Islands (AN)",
        "Chandigarh (CH)",
        "Dadra and Nagar Haveli and Daman and Diu (DH)",
        "Lakshadweep (LD)",
        "Delhi (DL)",
        "Puducherry (PY)"
        
    ],
  },
});
// Create an index on the cep field
petSchema.index({ pin: 1 });

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
