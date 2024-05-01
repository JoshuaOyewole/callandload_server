const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

// Define the schema for the Invoice document
const invoiceSchema = new Schema({
  buyerCompanyName: { type: String, required: true },
  buyerCompanyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  email: { type: String, required: true },
  sellerCompanyState: { type: String, required: true },
  sellerCompanyName: { type: String, required: true },
  pickupStateAddress: { type: String, required: true },
  buyerDestination: { type: String, required: true },
  quantity: { type: Number, required: true },
  productAmount: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  productName: { type: String },
  buyerPhoneNumber: { type: String, required: true },
  sellerPhoneNumber: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  sellerCompanyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  status: {
    type: String,
    default: "Not Paid",
    enum: ["Paid", "Not Paid", "Under Verification"],
  },
  // Include additional fields for the Invoice document
  accountNumber: { type: String, required: true },
  accountName: { type: String, required: true },
  bankName: { type: String, required: true },
},{
  timestamps: true // Add this option to enable automatic date generation
});

// Create the Mongoose model for the Invoice schema
const InvoiceModel =
  mongoose.models.InvoiceModel || mongoose.model("Invoice", invoiceSchema);
module.exports= InvoiceModel;
