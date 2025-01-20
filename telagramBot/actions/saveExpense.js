const botState = require("../state");
const User = require("../../models/User");
const Cost = require("../../models/Cost");
module.exports = {
    saveExpense: async (ctx) => {
        const state = botState.getState(ctx.from.id);
        const {amount, category, comment, date} = state.data;

        try {
            const user = await User.findOne({telegramId: ctx.from.id});

            const newCost = new Cost({
                amount,
                category: category.id,
                comment,
                date,
                user: user._id
            });

            await newCost.save();

            await ctx.reply(`✅ Your data has been saved successfully! Amount: ${amount}, Category: ${category.name}`);
        } catch (error) {
            console.error('Error saving data:', error);

            await ctx.reply('❌ Somethig went wrong while saving the data.');
        }
    }
}
