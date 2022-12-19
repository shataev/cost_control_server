const router = require('express').Router();
const Cost = require('../models/Cost');

// Get all costs
router.get('/costs', async (req, res) => {
    try {
        const costs = await Cost.find();

        res
            .status(201)
            .json(costs);
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json(error);
    }

})


// Add new cost
router.post('/cost', async (req, res) => {
    const {
        amount,
        product,
        comment,
    } = req.body;

    const newCost = new Cost({
        amount,
        product,
        comment,
    });

    try {
        const cost = await newCost.save();

        res
            .status(201)
            .json(cost);
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json(error);
    }
})

module.exports = router;
