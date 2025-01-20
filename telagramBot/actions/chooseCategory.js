const botState = require("../state");
const {Markup} = require("telegraf");

module.exports = {
    /**
     * Choose category action for trigger /category_(.+)\|(.+)/
     * @param ctx
     * @returns {Promise<void>}
     */
    chooseCategory: async (ctx) => {
        const id = ctx.match[1]; // Category ID
        const name = ctx.match[2]; // Category Name
        const state = botState.getState(ctx.from.id);

        botState.setState(ctx.from.id, {
            ...state,
            data: {
                ...state.data,
                category: {
                    id,
                    name
                }
            },
            substep: 'comment'
        })

        await ctx.reply(`You selected category: ${name}, id: ${id}`);

        await ctx.reply('Add an optional comment:', Markup.inlineKeyboard([
            Markup.button.callback('Skip', 'skip_comment') // Кнопка "Пропустить" для комментария
        ]));
    }
}
