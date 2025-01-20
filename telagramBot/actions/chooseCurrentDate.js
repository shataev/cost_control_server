const botState = require("../state");
const {showConfirmationMessage} = require("../utils/showConfirmationMessage");

module.exports = {
    chooseCurrentDate: async (ctx) => {
        const state = botState.getState(ctx.from.id);

        const currentDate = new Date().toLocaleDateString('en-US');

        botState.setState(ctx.from.id, {
            ...state,
            data: {
                ...state.data,
                date: currentDate
            }
        });

        await ctx.reply(`You selected current date: ${currentDate}`);

        showConfirmationMessage(ctx);
    }
}
