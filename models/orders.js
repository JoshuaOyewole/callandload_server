const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  buyerCompanyName: { type: String, required: true },
  buyerCompanyId: { type: Schema.Types.ObjectId, ref: "Company" },
  email: { type: String, required: true },
  sellerCompanyState: { type: String, required: true },
  sellerCompanyName: { type: String, required: true },
  pickupStateAddress: { type: String, required: true },
  buyerDestination: { type: String, required: true },
  quantity: { type: Number, required: true },
  productAmount: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  status: {
    type: String,
    default: "initiated",
    enum: ["initiated", "completed"],
  },
  productName: { type: String },
  buyerPhoneNumber: { type: String },
  sellerCompanyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  }, // Reference to the Company model
},{
  timestamps: true // Add this option to enable automatic date generation
});

// Create and export the model
const OrderModel =
  mongoose.models.OrderModel || mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
