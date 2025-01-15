const {Telegraf, Markup} = require("telegraf");
const User = require("../models/User");
const mongoose = require("mongoose");
const {message} = require("telegraf/filters");
const ObjectId = mongoose.Types.ObjectId;
const botState = require('./state');
const Category = require("../models/Category");
const Cost = require("../models/Cost");


const initBot = function () {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

    bot.start((ctx) => {
        ctx.reply(`Hey, ${ctx.from.first_name}! I'm going to help you with your expenses. 
        Use /add to add a new expense or /link to link your account to WannaTrack App`);

        console.log('Bot started')
    });

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
        ctx.reply('Add expense data');
        ctx.reply('Let\'s start with the amount of the expense. Enter the amount or load the photo of the receipt');

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

    bot.on(message('text'), async (ctx) => {
        const state = botState.getState(ctx.from.id);

        if (!state) {
            return ctx.reply('Enter the command to start');
        }

        if (state.step === 'link') {
            const userId = ctx.message.text;

            try {
                const user = await User.findById(new ObjectId(userId));

                if (!user) {
                    return ctx.reply('User with ID userId not found in WannaTrack App');
                }

                await User.updateOne(
                    {_id: userId},
                    {$set: {telegramId: ctx.from.id}}
                );

                ctx.reply('Your Telegram account is linked to WannaTrack App');
            } catch (e) {
                console.error('Error while linking Telegram', e)
                ctx.reply('Something went wrong. Provide correct WannaTrack user ID');
            }
        } else if (state.step === 'add') {
            if (state.substep === 'amount') {
                state.data.amount = ctx.message.text;

                state.substep = 'category';

                // Category Buttons
                try {
                    // Получаем пользователя и его категории
                    const user = await User.findOne({ telegramId: ctx.from.id });

                    let categories = await Category.find({
                        user:  [null, user._id],
                    })

                    if (!user || !categories || categories.length === 0) {
                        return ctx.reply('You have no categories. Please add some in your app.');
                    }

                    // Создаём кнопки для категорий
                    const categoryButtons = categories.map(category =>
                        Markup.button.callback(category.name, `category_${category._id}|${category.name}`)
                    );

                    // Отправляем клавиатуру с категориями
                    ctx.reply('Choose a category:', Markup.inlineKeyboard(categoryButtons, { columns: 2 }));
                } catch (error) {
                    console.error('Error fetching categories:', error);
                    ctx.reply('An error occurred while fetching your categories.');
                }

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

                state.data.date = date;

                const {amount, category, comment} = state.data;

                const confirmationMessage = `
                Please confirm the details:
                - **Amount:** ${amount}
                - **Category:** ${category.name}
                - **Comment:** ${comment}
                - **Date:** ${date}
                `.trim();

                ctx.replyWithMarkdown(confirmationMessage, Markup.inlineKeyboard([
                    Markup.button.callback('✅ Save', `save`),
                    Markup.button.callback('❌ Cancel', `cancel`)
                ]));

                console.log(state.data)
            }
        }
    });

    // Skip comment button handler
    bot.action('skip_comment', (ctx) => {
        const state = botState.getState(ctx.from.id);

        ctx.reply('Enter the date of the expense');

        state.substep = 'date';
    });

    // Category button handler
    bot.action(/category_(.+)\|(.+)/, async (ctx) => {
        const id = ctx.match[1]; // Извлекаем категорию из ID действия
        const name = ctx.match[2]; // Извлекаем категорию из ID действия
        const state = botState.getState(ctx.from.id);

        state.data.category = {
           id,
           name
        }

        await ctx.reply(`You selected category: ${name}, id: ${id}`);

        state.substep = 'comment';

        await ctx.reply('Add an optional comment or press "Skip":', Markup.inlineKeyboard([
            Markup.button.callback('Skip', 'skip_comment') // Кнопка "Пропустить" для комментария
        ]));
    });

    // Save button handler
    bot.action('save', async (ctx) => {
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
    });

    // Cancel button handler
    bot.action('cancel', async (ctx) => {
        botState.clearState(ctx.from.id);

        await ctx.reply('❌ Operation cancelled.');
    });

    // Choose current date button handler
    bot.action('choose_current_date', async (ctx) => {
        const state = botState.getState(ctx.from.id);

        const currentDate = new Date().toLocaleDateString('en-US');

        state.data.date = currentDate;

        await ctx.reply(`You selected current date: ${currentDate}`);

        const {amount, category, comment, date} = state.data;

        const confirmationMessage = `
                Please confirm the details:
                - **Amount:** ${amount}
                - **Category:** ${category.name}
                - **Comment:** ${comment}
                - **Date:** ${date}
                `.trim();

        ctx.replyWithMarkdown(confirmationMessage, Markup.inlineKeyboard([
            Markup.button.callback('✅ Save', `save`),
            Markup.button.callback('❌ Cancel', `cancel`)
        ]));
    })

    bot.launch();

    console.log('Bot launched')
}

module.exports = { initBot }
