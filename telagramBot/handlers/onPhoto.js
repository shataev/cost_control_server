const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');
const {preprocessImage, extractTextFromImage} = require("../utils");

// Путь к директории
const tempDir = path.resolve(__dirname, './temp');

// Создаем директорию, если её нет
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const bot = new Telegraf('YOUR_TELEGRAM_BOT_TOKEN');

const onPhoto = async (ctx) => {
    const fileId = ctx.message.photo.pop().file_id;
    const fileUrl = await ctx.telegram.getFileLink(fileId);

    const response = await fetch(fileUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    const processedImageBuffer = await preprocessImage(buffer);
    const text = await extractTextFromImage(processedImageBuffer);

    ctx.reply(`Data from receipt:\n\n${text}`);
}

module.exports = onPhoto;
