const botState = require("../state");
const {Markup} = require("telegraf");

module.exports = {
    showConfirmationMessage: (ctx, message) => {
        const {amount, category, comment, date} = botState.getState(ctx.from.id).data;

        const confirmationMessage = `
    Please confirm the details:
    - **Amount:** ${amount}
    - **Category:** ${category.name}
    - **Comment:** ${comment}
    - **Date:** ${date.toLocaleString()}
    `.trim();

        return ctx.replyWithMarkdown(confirmationMessage, Markup.inlineKeyboard([
            Markup.button.callback('✅ Save', `save_expense`),
            Markup.button.callback('❌ Cancel', `cancel`)
        ]));
    }
}
