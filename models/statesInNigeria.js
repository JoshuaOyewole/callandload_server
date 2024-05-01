const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

// Define schema for the State document
const AllStatesSchema = new Schema({
  name: { type: String, required: true },
},{
  timestamps: true // Add this option to enable automatic date generation
});

// Create and export the model
const StateModel =
  mongoose.models.StateModel || mongoose.model("statesInNigeria", AllStatesSchema);
module.exports = StateModel;
