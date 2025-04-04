const router = require('express').Router();
const Cost = require('../models/Cost');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Fund = require('../models/Fund');
const FundTransaction = require('../models/FundTransaction');

// Get all user's costs
router.get('/costs', async (req, res) => {
    try {
        const userId = new ObjectId(req.query.userId);
        const {dateFrom, dateTo} = req.query;

        const allCosts = await Cost.find({
            user: userId,
            createdAt: {
                $gte: dateFrom,
                $lt: dateTo
            }
        })

        const costs = await Cost.aggregate([
            {
                $match: {
                    $and: [
                        {
                            user: userId,
                        },
                        {
                            createdAt: {
                                $gte: new Date(dateFrom),
                                $lt: new Date(dateTo)
                            }
                        }
                    ]

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
                $unwind: '$category', // Unwind the "category" array created by $lookup
            },
            {
                $lookup: {
                    from: 'funds',
                    localField: 'fund',
                    foreignField: '_id',
                    as: 'fund'
                }
            },
            {
                $unwind: {
                    path: '$fund',
                    preserveNullAndEmptyArrays: true // Если у расхода нет фонда, оставляем null
                }
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
        date,
        fundId
    } = req.body;

    try {
        // Create new cost
        const newCost = new Cost({
            amount,
            category: category,
            comment,
            date,
            user: new ObjectId(userId),
            fund: fundId ? new ObjectId(fundId) : null
        });

        // If fund is provided, update fund balance
        if (fundId) {
            const fund = await Fund.findById(fundId);
            
            if (!fund) {
                return res.status(404).json({ error: 'Fund not found' });
            }

            if (fund.currentBalance < amount) {
                return res.status(400).json({ error: 'Insufficient funds' });
            }

            // Update fund balance
            fund.currentBalance -= amount;
            await fund.save();

            // Create fund transaction record
            const fundTransaction = new FundTransaction({
                userId: new ObjectId(userId),
                fundId: new ObjectId(fund),
                type: 'expense',
                amount: -amount,
                description: comment || 'Cost payment'
            });
            await fundTransaction.save();
        }

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
