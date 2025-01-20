const {preprocessImage, extractTextFromImage, extractAmount} = require("../utils");
const botState = require('../state');

const onPhoto = async (ctx) => {
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

    const state = ctx.state;
    console.log('state', state);

    const fileId = ctx.message.photo.pop().file_id;
    const fileUrl = await ctx.telegram.getFileLink(fileId);

    const response = await fetch(fileUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    const processedImageBuffer = await preprocessImage(buffer);
    const text = await extractTextFromImage(processedImageBuffer);
    const amount = extractAmount(text);

    if (!amount) {
        return ctx.reply('Amount not found. Please send correct photo');
    }

    ctx.reply(`Do you want to add ${amount}`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Add',
                        callback_data: 'use_amount_from_photo_' + amount
                    }
                ]
            ]
        }
    });
}

module.exports = onPhoto;
