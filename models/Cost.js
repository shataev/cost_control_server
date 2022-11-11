const mongoose = require("mongoose");

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
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Cost', CostSchema);

