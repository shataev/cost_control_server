const User = require("../../models/User");
const Category = require("../../models/Category");

module.exports = {
    getUserCategoriesByTelegramId: async (telegramId) => {
        const user = await User.findOne({ telegramId: telegramId });

        let categories = await Category.find({
            user:  [null, user._id],
        })

        if (!user || !categories || categories.length === 0) {
            throw new Error('You have no categories. Please add some in your app.');
        }

        return categories;
    }
}
