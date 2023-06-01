const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));



//MONGOOSE AND MODELS


mongoose.connect('mongodb+srv://rishabhraghav2012:7aaADi8dOiwTrpc1@medico.yih80di.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    // useUnifiedTopolody: true
}).then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  const medicineSchema = new mongoose.Schema({
    name:String,
    description: String,
    quantity: Number
  });
  const Medicine = mongoose.model('Medicine', medicineSchema);







  //ALL ROUTES

  app.get('/', (req, res) => {
    // Fetch data from MongoDB
    // console.log("hey");
    Medicine.find()
      .then(data => {
        // Send the retrieved data as a response
        // console.log("server side get method data ",data);
        res.json(data);
      })
      .catch(error => {
        console.error('Error retrieving data:', error);
        res.status(500).send('Internal Server Error');
        // console.log("server side get method data ",data);
      });
  });

  app.get("/search", (req, res) =>  {
    const searchTerm = req.body.searchTerm;
    Medicine.find({ name: { $regex: searchTerm, $options: 'i' } })
    .then(res.json(data))
    .catch((error) => {
      console.error('Error searching for medicine:', error);
      res.status(500).send('Internal Server Error');
    });
  });

  app.post('/', (req, res) => {
    const {name, description, quantity} = req.body;

    Medicine.findOne({ name })
    .then(existingMedicine => {
      if (existingMedicine) {
        // If the medicine already exists, update its description and quantity
        existingMedicine.description = description;
        existingMedicine.quantity = quantity;

        existingMedicine
          .save()
          .then(updatedMedicine => {
            res.json(updatedMedicine);
          })
          .catch(error => {
            console.error('Error updating medicine:', error);
            res.status(500).send('Internal Server Error');
          });
      } else {
        // If the medicine doesn't exist, create a new one
        const newMedicine = new Medicine({
          name: name,
          description: description,
          quantity: quantity
        });

        newMedicine
          .save()
          .then(savedMedicine => {
            res.json(savedMedicine);
          })
          .catch(error => {
            console.error('Error saving medicine:', error);
            res.status(500).send('Internal Server Error');
          });
      }
    })
    .catch(error => {
      console.error('Error finding medicine:', error);
      res.status(500).send('Internal Server Error');
    });
  });

  app.delete('/:id', (req, res) => {
    const {id} = req.params;
    
    Medicine.findByIdAndDelete(id)
    .then(deletedMedicine => {
      if (!deletedMedicine) {
        // If the medicine with the provided ID doesn't exist
        return res.status(404).json({ message: 'Medicine not found' });
      }

      res.json({ message: 'Medicine deleted successfully' });
    })
    .catch(error => {
      console.error('Error deleting medicine:', error);
      res.status(500).send('Internal Server Error');
    });
  });



  //START SERVER


app.listen(PORT, () => {
    console.log("server started at port 3000");
})