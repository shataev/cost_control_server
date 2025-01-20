const {getUserCategoriesByTelegramId} = require("./getUserCategoriesByTelegramId");

module.exports = {
    getCategoryByName: async (name, telegramId) => {
        const categories = await getUserCategoriesByTelegramId(telegramId);

        return categories.find(category => category.name === name);
    }
}
