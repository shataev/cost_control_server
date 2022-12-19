const User = require("../models/User");

module.exports = {
    async checkUserInDatabaseById(req, res, next) {
        const userId = req.userId;

        try {
            const user = await User.findOne({
                id: userId,
            });

            if (!user) {
                return res.status(401).send('Incorrect userId');
            }

            const {username, email} = user;

            req.user = {
                email,
                username,
                id: userId
            }

            next();
        } catch (error) {
            return res.status(500).send('Cannot find user in database');
        }
    }
}