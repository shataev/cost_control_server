const {Telegraf} = require("telegraf");
const User = require("../models/User");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const initBot = function () {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

    bot.start((ctx) => {
        ctx.reply(`Привет, ${ctx.from.first_name}! Я помогу вам с учетом расходов.`);
        console.log('Bot started')
    });

    bot.command('link', (ctx) => {
        ctx.reply('Enter your user ID from WannaTrack App');
    });

    bot.on('text', async (ctx) => {
        const userId = ctx.message.text;

        try {
            const user = await User.findById(new ObjectId(userId));

            if (!user) {
                return ctx.reply('User with ID userId not found in WannaTrack App');
            }

            await User.updateOne(
                { _id: userId },
                { $set: { telegramId: ctx.from.id } }
            );

            ctx.reply('Your Telegram account is linked to WannaTrack App');
        } catch (e) {
            console.error('Error while linking Telegram', e)
            ctx.reply('Something went wrong. Provide correct WannaTrack user ID');
        }
    });

    bot.launch();

    console.log('Bot launched')
}

module.exports = { initBot }
