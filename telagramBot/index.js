const {Telegraf, Markup} = require("telegraf");
const User = require("../models/User");
const mongoose = require("mongoose");
const {message} = require("telegraf/filters");
const ObjectId = mongoose.Types.ObjectId;
const botState = require('./state');
const Category = require("../models/Category");
const Cost = require("../models/Cost");
const onPhoto = require("./handlers/onPhoto");
const onText = require("./handlers/onText");
const {chooseCategory} = require("./actions/chooseCategory");
const {skipComment} = require("./actions/skipComment");
const {saveExpense} = require("./actions/saveExpense");
const {showConfirmationMessage} = require("./utils/showConfirmationMessage");
const {chooseCurrentDate} = require("./actions/chooseCurrentDate");
const {useAmountFromPhoto} = require("./actions/useAmountFromPhoto");


const initBot = function () {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

    bot.start((ctx) => {
        ctx.reply(`Hey, ${ctx.from.first_name}! I'm going to help you with your expenses. 
        Use /add to add a new expense or /link to link your account to WannaTrack App`);

        console.log('Bot started')
    });

    // COMMANDS

    // Command Link Telegram account to WannaTrack App
    // TODO: link account via OTP code
    bot.command('link', (ctx) => {
        ctx.reply('Enter your user ID from WannaTrack App');

        botState.setState(ctx.from.id, {
            step: 'link'
        });
    });

    // Command Add expense
    bot.command('add', (ctx) => {
        ctx.reply('Add expense data' +
            '\nLet\'s start with the amount of the expense. Enter the amount or load the photo of the receipt');

        botState.setState(ctx.from.id, {
            step: 'add',
            substep: 'amount',
            data: {
                amount: null,
                category: null,
                comment: null,
                date: null
            }
        });
    });


    // HANDLERS
    bot.on(message('photo'), onPhoto);

    bot.on(message('text'), onText);


    // ACTIONS
    bot.action(/use_amount_from_photo_(.+)/, useAmountFromPhoto);
    bot.action(/category_(.+)\|(.+)/, chooseCategory);

    bot.action('skip_comment', skipComment);

    bot.action('save_expense', saveExpense);

    bot.action('cancel', async (ctx) => {
        botState.clearState(ctx.from.id);

        await ctx.reply('❌ Operation cancelled.');
    });

    bot.action('choose_current_date', chooseCurrentDate)

    bot.launch();

    console.log('Bot launched')
}

module.exports = { initBot }
