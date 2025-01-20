const botState = require("../state");

module.exports = {
    updateAmount: (ctx, amount) => {
        const state = botState.getState(ctx.from.id);

        botState.setState(ctx.from.id, {
            ...state,
            data: {
                amount
            }
        });
    }
}
