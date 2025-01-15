const {preprocessImage, extractTextFromImage} = require("../utils");

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
