const router = require('express').Router();
const Fund = require('../models/Fund');
const FundTransaction = require('../models/FundTransaction');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Get all user's funds
router.get('/funds', async (req, res) => {
    try {
        const userId = new ObjectId(req.query.userId);

        let funds = await Fund.find({
            userId: userId,
        })

        res
            .status(200)
            .json(funds);
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json(error);
    }

})


// Add new fund
router.post('/funds', async (req, res) => {
    const {
        name,
        icon,
        userId,
        description,
        initialBalance
    } = req.body;

    try {
        const newFund = new Fund({
            name,
            icon,
            description,
            initialBalance,
            currentBalance: initialBalance,
            userId: userId ? new ObjectId(userId) : null
        });

        const fund = await newFund.save();

        res
            .status(201)
            .json(fund);
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json(error);
    }
})

// Update fund
router.put('/funds/:id', async (req, res) => {
    const {id} = req.params;
    const {name, description, currentBalance, icon, isDefault} = req.body;

    try {
        const oldFund = await Fund.findById(id);

        const fund = await Fund.findByIdAndUpdate(
            id,
            {name, description, currentBalance, icon, isDefault},
            {new: true}
        );

        if (!fund) {
            return res.status(404).json({error: 'Fund is not found'});
        }

        // Create Transaction to adjust the balance
        const adjustment = new FundTransaction({
            userId: fund.userId,
            fundId: fund.id,
            type: 'adjustment',
            amount: fund.currentBalance - oldFund.currentBalance,
            description: 'Manual adjustment',
        });
        await adjustment.save();

        res.status(200).json(fund);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Delete fund
router.delete('/funds/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const fund = await Fund.findByIdAndDelete(id);

        if (!fund) {
            return res.status(404).json({ error: 'Fund not found' });
        }

        await FundTransaction.deleteMany({ fundId: id });

        res.status(200).json({ message: 'Fund deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Transfer funds between two funds
router.post('/funds/transfer', async (req, res) => {
    const {userId, fromFundId, toFundId, amount, description} = req.body;

    try {
        if (fromFundId === toFundId) {
            return res.status(400).json({error: 'Funds must be different'});
        }

        const fromFund = await Fund.findById(fromFundId);
        const toFund = await Fund.findById(toFundId);

        if (!fromFund || !toFund) {
            return res.status(404).json({error: 'One of the founds is not found'});
        }

        if (fromFund.currentBalance < amount) {
            return res.status(400).json({error: 'Insufficient amount of money in source fund'});
        }

        // Create Transactions for each funds
        const outgoingTransaction = new FundTransaction({
            userId,
            fundId: fromFundId,
            type: 'transfer-out',
            amount: -amount,
            description,
        });
        await outgoingTransaction.save();

        const incomingTransaction = new FundTransaction({
            userId,
            fundId: toFundId,
            type: 'transfer-in',
            amount,
            description,
        });
        await incomingTransaction.save();

        // Update funds
        await Fund.findByIdAndUpdate(fromFundId, {$inc: {currentBalance: -amount}});
        await Fund.findByIdAndUpdate(toFundId, {$inc: {currentBalance: amount}});

        res.status(200).json("Transferred successfully!");
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// GET /api/funds/:id
router.get('/funds/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const fund = await Fund.findById(id);
        if (!fund) {
            return res.status(404).json({error: 'Fund is not found'});
        }

        res.json({
            id: fund._id,
            name: fund.name,
            icon: fund.icon,
            description: fund.description,
            initialBalance: fund.initialBalance,
            currentBalance: fund.currentBalance,
            createdAt: fund.createdAt,
            updatedAt: fund.updatedAt,
            isDefault: fund.isDefault,
        });
    } catch (error) {
        console.error('Get fund error:', error);
        res.status(500).json({error: error.message});
    }
});

// Get all transactions for a fund
router.get('/funds/:id/transactions', async (req, res) => {
    const {id} = req.params;

    try {
        const transactions = await FundTransaction.find({fundId: id});
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
