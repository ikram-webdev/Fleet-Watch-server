const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    vehicleId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vehicle', // This links to the vehicle model
        required: true 
    },
    driverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // This links to the user model
        required: true 
    },
    assignedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
