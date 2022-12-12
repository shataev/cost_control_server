const CryptoJS = require("crypto-js");
const User = require("../models/User");

/**
 * Создает в базе нового юзера, предварительно захешировав его пароль,
 * пишет его в req и передает управление дальше
 * TODO: валидировать входные параметры
 * @type {{createUser(*, *, *): Promise<void>}}
 */
module.exports = {
    async createUser(req, res, next) {
        const {
            username,
            email,
            password: rawPassword
        } = req.body;

        const password = CryptoJS.AES.encrypt(rawPassword, process.env.SECRET_KEY).toString();

        const newUser = new User({
            username,
            email,
            password
        });

        try {
            const user = await newUser.save();

            req.user = {
                username: user.username,
                email: user.email,
                id: user._id
            };

            next();
        } catch (error) {
            res
                .status(500)
                .json(error);
        }
    }
}