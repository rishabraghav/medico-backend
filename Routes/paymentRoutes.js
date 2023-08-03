const stripe = require("stripe")("sk_test_51NTKJISEZD8WET6J3KoM1S1WoDotxqE8crHGTl98Hk5lWFARICFWV62GjhBLNoEtAZuAlNzHKzK9XyMYr2bUJmBx00y2VbV7YT");
const { v4: uuid } = require('uuid');


const express = require('express');

const router = express.Router();

const auth = (req, res, next) => {
    if(req.query.admin === 'true'){
        next();
    } else {
        res.send("NO AUTH");
    }
}

router.get('/payment', auth, (req, res) => {
    res.send("Payments server for testing");
    
})

router.post('/payment', (req, res) => {
    const {product, token} = req.body;

    console.log("product: ", product);
    console.log("Price: ", product.price);

    const idempotencyKey = uuid();

    return stripe.customers.create({
        email: token.email,
        source: token.id,
    })
    .then((customer) => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: "inr",
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country,
                },  
            },
        }, {idempotencyKey})
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: err.message});
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.message });
      });
   
})

module.exports = router;