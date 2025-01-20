const {showCategoryButtons} = require("../utils/showCategoryButtons");
const {updateAmount} = require("../utils/updateAmount");

module.exports = {
    useAmountFromPhoto: async (ctx) => {
        const amount = ctx.match[1];

        updateAmount(ctx, amount);
        await showCategoryButtons(ctx);
    }
}
