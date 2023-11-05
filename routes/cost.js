const router = require('express').Router();
const Cost = require('../models/Cost');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Get all user's costs
router.get('/costs', async (req, res) => {
    try {
        const userId = new ObjectId(req.query.userId);

        const allCosts = await Cost.find({
            user: userId
        })

        const costs = await Cost.aggregate([
            {
                $match: {
                    user: userId,
                },
            },
            {
                $lookup: {
                    from: 'categories', // Replace with the actual name of your "themes" collection
                    localField: 'category', // Field in the "posts" collection
                    foreignField: '_id', // Field in the "themes" collection
                    as: 'category', // Create a new field named "theme" with the matching theme document
                },
            },
            {
                $unwind: '$category', // Unwind the "theme" array created by $lookup
            },
            {
                $group: {
                    _id: '$category._id',
                    amount: { $sum: '$amount' },
                    category: {$first: '$category.name'},
                    icon: {$first: '$category.icon'},
                    costs: { $push: '$$ROOT' },
                }
            },
            {
                $sort: {
                    amount: -1
                }
            }
        ]);

        res
            .status(200)
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
        category,
        comment,
        userId,
        date
    } = req.body;

    const newCost = new Cost({
        amount,
        category: category,
        comment,
        date,
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
