const express = require('express');
const Patient = require('./patientsModel');

const router = express.Router();

router.get('/', (req, res) => {
  Patient.find()
    .then((data) => {
      console.log("Patients ROOT")
      res.json(data);
    })
    .catch((error) => {
      cconsole.error('Error retrieving data:', error);
      res.status(500).send('Internal Server Error');
    });
});

router.post('/add', (req, res) => {
  const patient = req.body;
  // console.log(patient.Info);
  const InfoArray = patient.Info;
  const lastElement = InfoArray[InfoArray.length - 1];
  console.log(lastElement);

  Patient.findOneAndUpdate(
    { contact: patient.contact },
    { $push: { Info: lastElement } },
    { new: true })
    .then((updatedPatient) => {
      if (updatedPatient) {
        console.log("patient updated: ", updatedPatient);
      } else {
        const newPatient = new Patient({
          Uhid: patient.Uhid,
          name: patient.name,
          age: patient.age,
          sex: patient.sex,
          address: patient.address,
          contact: patient.contact,
          Info: InfoArray,
        });

        newPatient.save()
          .then((savedPatient) => {
            console.log('Patient saved:', savedPatient);
            res.json(savedPatient);
          })
          .catch((error) => {
            console.error('Error saving patient:', error);
            res.status(500).json({ error: 'Failed to save patient.' });
          });
      }
    })
    .catch((error) => {
      console.error("error in updating the patient: ", error);
    })
});

router.delete('/:id', async (req, res) => {
  const {id} = req.params;
  
  try{
    const deletedPatient = await Patient.findByIdAndDelete(id);

    if(!deletedPatient) return res.status(404).json({error: "Patient not found in the database"});
    return res.json({message: "Patient is deleted successfully"});
  } catch(err) {
    console.error("error in deleting patient in server side", err);

    return res.status(500).json({error: "error in deleting patient from server side"});
  }
});


router.delete('/:id/:infoId', async (req, res) => {
  const { id, infoId } = req.params;
  console.log(id, infoId);
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { $pull: { Info: { _id: infoId } } },
      { new: true }
    );

    if(!updatedPatient) return res.status(404).json({error: "Patient's record not found in database"}); 
    return res.json({message: "Patient Info is deleted from the database successfully"});
  } catch (err) {
    console.error("error in deleting the patient record from server side: ", err);

    return res.status(500).json({error: "error in deleting patient Info from server side"});
  }
  });



module.exports = router;