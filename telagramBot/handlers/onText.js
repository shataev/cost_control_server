const User = require("../../models/User");
const Category = require("../../models/Category");
const {Markup} = require("telegraf");
const {getStateByTelegramId} = require("../utils");
const {linkTelegramAccountToApp} = require("../utils/linkTelegramAccountToApp");
const botState = require("../state");
const {getUserCategoriesByTelegramId} = require("../utils/getUserCategoriesByTelegramId");
const {showConfirmationMessage} = require("../utils/showConfirmationMessage");
const {showCategoryButtons} = require("../utils/showCategoryButtons");
const {updateAmount} = require("../utils/updateAmount");

const onText = async (ctx) => {
    const state = botState.getState(ctx.from.id);

    if (!state) {
        return ctx.reply('Enter the command to start');

        // TODO: check if user is linked
        //  and if not, ask to link
        //  and if yes, set state to 'add'
    }

    if (state.step === 'link') {
        try {
            await linkTelegramAccountToApp(ctx);

            ctx.reply('Your Telegram account is linked to WannaTrack App');
        } catch (e) {
            console.error('Error while linking Telegram', e)
            ctx.reply('Something went wrong. Provide correct WannaTrack user ID');
        }
    } else if (state.step === 'add') {
        if (state.substep === 'amount') {
            updateAmount(ctx, ctx.message.text);

            // Category Buttons
            await showCategoryButtons(ctx);
        } else if (state.substep === 'comment') {
            state.data.comment = ctx.message.text;
            state.substep = 'date';

            ctx.reply(
                'Enter the date of the expense in DD.MM.YYYY format or set current date',
                Markup.inlineKeyboard([
                    Markup.button.callback('Choose current date', 'choose_current_date')
                ])
            );
        } else {
            const date = new Date(ctx.message.text);

            if (date.toString() === 'Invalid Date') {
                return ctx.reply('Invalid date format. Please enter the date in DD.MM.YYYY format');
            }

            botState.setState(ctx.from.id, {
                ...state,
                data: {
                    ...state.data,
                    date
                }
            });

            await showConfirmationMessage(ctx);


            console.log(botState.getState(ctx.from.id))
        }
    }
}

module.exports = onText;
