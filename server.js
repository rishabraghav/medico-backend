const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const uuid = require("uuid")
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});



//MONGOOSE CONNECTION


mongoose.connect("mongodb://localhost:27017/medicineDatabase", {
    useNewUrlParser: true,
    // useUnifiedTopolody: true
}).then(() => {
    console.log('Connected to MongoDB');
    // res.send(`connected to ${process.env.MONGO_URI}`);
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


  //ALL ROUTES

  const medicineRoutes = require('./Routes/medicineRoutes');
  const patientsRoutes = require('./Routes/patientRoutes');
  const paymentRoutes = require('./Routes/paymentRoutes');

  app.use('/medicine', medicineRoutes);
  app.use('/patients', patientsRoutes);
  app.use('/payments', paymentRoutes);


  //START SERVER


app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`);
})