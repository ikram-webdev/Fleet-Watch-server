const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    model: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Maintenance", "On Trip"],
      default: "Available",
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lastMaintenanceDate: {
      type: Date,
    },
    currentTrip: {
      startTime: { type: Date },
      destination: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", VehicleSchema);
