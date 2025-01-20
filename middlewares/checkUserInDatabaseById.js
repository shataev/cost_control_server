const User = require("../models/User");

module.exports = {
    async checkUserInDatabaseById(req, res, next) {
        const {userId} = req.body;

        try {
            const user = await User.findOne({
                id: userId,
            });

            if (!user) {
                return res.status(400).send(`User with id ${userId} not found`);
            }

            req.user = {...user};
            req.userId = user._id;

            next();
        } catch (error) {
            return res.status(500).send('Cannot find user in database');
        }
    }
}