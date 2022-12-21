const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const CostSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Cost', CostSchema);

