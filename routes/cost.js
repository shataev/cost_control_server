const router = require('express').Router();
const Cost = require('../models/Cost');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Get all user's costs
router.get('/costs', async (req, res) => {
    try {
        const userId = new ObjectId(req.query.userId);

        const costs = await Cost.find({
            user: userId,
        });

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
        userId
    } = req.body;

    const newCost = new Cost({
        amount,
        product,
        comment,
        user: new ObjectId(userId)
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
