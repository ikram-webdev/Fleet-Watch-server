const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    plateNumber: { 
        type: String, 
        required: true, 
        unique: true,
        uppercase: true // Auto capital letters for plate number
    },
    model: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Available', 'Maintenance', 'On Trip'], // Sirf yehi 3 options allow honge
        default: 'Available' 
    },
    assignedDriver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    },
    // --- Nayi Fields jo Features chalane ke liye zaroori hain ---
    lastMaintenanceDate: { 
        type: Date 
    },
    currentTrip: {
        startTime: { type: Date },
        destination: { type: String }
    }
}, { timestamps: true }); // Is se 'createdAt' aur 'updatedAt' khud ban jayenge

module.exports = mongoose.model('Vehicle', VehicleSchema);