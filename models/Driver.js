const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User table se link
    licenseNumber: { type: String, required: true },
    status: { type: String, default: 'Available' }, // Available 
    assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', default: null }
});

module.exports = mongoose.model('Driver', DriverSchema);