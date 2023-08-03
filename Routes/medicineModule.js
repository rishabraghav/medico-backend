const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name:String,
    description: String,
    quantity: Number
  });
  const Medicine = mongoose.model('Medicine', medicineSchema);

  module.exports = Medicine;