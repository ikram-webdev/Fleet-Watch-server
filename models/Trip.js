const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    vehicleId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vehicle', 
        required: true 
    },
    driverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    startTime: { 
        type: Date, 
        default: Date.now 
    },
    endTime: { 
        type: Date 
    },
    status: { 
        type: String, 
        enum: ['Active', 'Completed'], 
        default: 'Active' 
    },

    startLocation: { type: String },
    endLocation: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);