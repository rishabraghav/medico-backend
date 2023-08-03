
const Medicine = require('./medicineModule');
const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
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
        res.status(500).send('Internal Server Error: from backend');
        // console.log("server side get method data ",data);
      });
  });

  router.get("/search", (req, res) =>  {
    const searchTerm = req.body.searchTerm;
    Medicine.find({ name: { $regex: searchTerm, $options: 'i' } })
    .then(res.json(data))
    .catch((error) => {
      console.error('Error searching for medicine:', error);
      res.status(500).send('Internal Server Error');
    });
  });

  router.post('/add', (req, res) => {
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

  router.delete('/:id', (req, res) => {
    const {id} = req.params;
    
    Medicine.deleteOne({ _id: id })
  .then(deletedMedicine => {
    if (deletedMedicine.deletedCount === 0) {
      // If the medicine with the provided ID doesn't exist
      console.log("id:", id);
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({ message: 'Medicine deleted successfully' });
  })
  .catch(error => {
    console.error('Error deleting medicine:', error);
    res.status(500).send('Internal Server Error');
  });
  });


  module.exports = router;