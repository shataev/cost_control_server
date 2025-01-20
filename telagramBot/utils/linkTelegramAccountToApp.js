const User = require("../../models/User");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    linkTelegramAccountToApp: async (ctx) => {
        const userId = ctx.message.text;

        const user = await User.findById(new ObjectId(userId));

        if (!user) {
            throw new Error('User with ID userId not found in WannaTrack App');
        }

        await User.updateOne(
            {_id: userId},
            {$set: {telegramId: ctx.from.id}}
        );
    }
}
