const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  licenseNumber: { type: String, required: true },
  status: { type: String, default: "Available" },
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    default: null,
  },
});

module.exports = mongoose.model("Driver", DriverSchema);
