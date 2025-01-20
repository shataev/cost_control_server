const botState = require("../state");

module.exports = {
    skipComment: async (ctx) => {
        const state = botState.getState(ctx.from.id);

        botState.setState(ctx.from.id, {
            ...state,
            substep: 'date'
        })

        ctx.reply('Enter the date of the expense');
    }
}
