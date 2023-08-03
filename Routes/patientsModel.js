const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    Uhid: Number,
    name: String,
    age: Number,
    sex: String,
    address: String,
    contact: Number,
    Info: [
        {
            date: String,
            symptoms: String,
            tests: String,
            medicineSuggested: String
        },
    ],
});


const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;