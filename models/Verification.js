const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const VerificationSchema = new mongoose.Schema(
{
      uniqueString: {
          type: String,
          required: true
      },
      createdAt: {
          type: Date,
          default: Date.now()
      },
      expiresAt: {
          type: Date,
          default: new Date(Date.now() + 1000*60*60*6).getTime()
      },
      user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
      }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Verification', VerificationSchema);