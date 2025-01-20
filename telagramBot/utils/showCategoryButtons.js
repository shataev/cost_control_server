const {getUserCategoriesByTelegramId} = require("./getUserCategoriesByTelegramId");
const {Markup} = require("telegraf");

module.exports = {
    showCategoryButtons: async (ctx) => {
        try {
            const categories = await getUserCategoriesByTelegramId(ctx.from.id);

            const categoryButtons = categories.map(category =>
                Markup.button.callback(category.name, `category_${category._id}|${category.name}`)
            );

            ctx.reply('Choose a category:', Markup.inlineKeyboard(categoryButtons, { columns: 2 }));
        } catch (error) {
            console.error('Error fetching categories:', error);
            ctx.reply('An error occurred while fetching your categories.');
        }
    }
}
