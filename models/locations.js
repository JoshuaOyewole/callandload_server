const mongoose = require("mongoose");
// Define a schema
const Schema = mongoose.Schema;

// Define schema for the Location document
const LocationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true // Reference to the State model
  }
}, {
  timestamps: true // Add this option to enable automatic date generation
});

const LocationModel =
  mongoose.models.locations || mongoose.model("Location", LocationSchema);
module.exports = LocationModel;
