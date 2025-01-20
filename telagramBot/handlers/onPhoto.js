const {preprocessImage, extractTextFromImage, extractAmount} = require("../utils");
const botState = require('../state');
const {getCategoryByName} = require("../utils/getCategoryByName");
const {showConfirmationMessage} = require("../utils/showConfirmationMessage");

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

    const fileId = ctx.message.photo.pop().file_id;
    const fileUrl = await ctx.telegram.getFileLink(fileId);

    const response = await fetch(fileUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    const processedImageBuffer = await preprocessImage(buffer);
    const text = await extractTextFromImage(processedImageBuffer);
    const amount = extractAmount(text);

    const caption = ctx.message.caption;

    if (!amount) {
        return ctx.reply('Amount not found. Please provide correct photo or send the amount as a text message');
    }

    if (!caption) {
        return ctx.reply(`Do you want to add ${amount}`, {
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

    // If we have a caption it means we want to add an expense in one step
    // via sending receipt photo with category name and comment
    const [categoryName, comment] = caption.split('\n');
    const category = await getCategoryByName(categoryName);

    // If category not matched with any users categories, ask to add it
    if (!category) {
        return ctx.reply(`Category not found. Do you want to add ${amount}`, {
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

    botState.setState(ctx.from.id, {
        ...botState.getState(ctx.from.id),
        data: {
            amount,
            category: {
                id: category._id,
                name: category.name
            },
            comment: comment,
            date: new Date()
        }
    });

    await showConfirmationMessage(ctx);
}

module.exports = onPhoto;
