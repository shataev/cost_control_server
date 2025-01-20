const router = require('express').Router();
const Category = require('../models/Category');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Get all user's categories
router.get('/category', async (req, res) => {
    try {
        const userId = new ObjectId(req.query.userId);

        let categories = await Category.find({
            user:  [null, userId],
        })

        categories = categories.map(category => {
            const {name, icon, _id: value} = category;

            return {
                name, icon, value
            }
        })

        res
            .status(201)
            .json(categories);
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json(error);
    }

})


// Add new category
router.post('/category', async (req, res) => {
    const {
        name,
        icon,
        userId,
    } = req.body;

    const newCategory = new Category({
        name,
        icon,
        user: userId ? new ObjectId(userId) : null
    });

    try {
        const category = await newCategory.save();

        res
            .status(201)
            .json(category);
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json(error);
    }
})

module.exports = router;
