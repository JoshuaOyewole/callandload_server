const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;
// Define a schema for addresses
const addressSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

// Define a schema for states
const stateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  addresses: [addressSchema], // Array of addresses
});

// Define a schema for branches
const branchSchema = new Schema({
  state: stateSchema, // Nested state schema
});

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    companyAddress: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 200,
    },
    states: {
      type: [stateSchema], // Array of state objects
      validate: {
        validator: function () {
          return this.category === "seller" ? this.states.length > 0 : true;
        },
        message: 'States are required for sellers'
      }
    },
    state: {
      type: String, // Single state for buyers
      required: function() {
        return this.category === "buyer";
      }
    },
    //states: [stateSchema], // Array of state objects
    phoneNumber: {
      type: String,
      unique: true,
      maxLength: 200,
    },
    password: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["buyer", "seller"],
    },
    accountVerified: {
      type: Boolean,
      required: true,
      default: false,
      enum: [true, false],
    },
    price: { type: String },
    accountNumber: { type: String },
    accountName: { type: String },
    bankName: { type: String },
  },
  { timestamps: true }
);

const Company =
  mongoose.models.company || mongoose.model("company", companySchema);
module.exports = Company;
