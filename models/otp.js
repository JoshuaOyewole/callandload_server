const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OtpSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

const OtpModel = mongoose.models.otp || mongoose.model("otp", OtpSchema);
module.exports = OtpModel;
