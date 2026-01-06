const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// --- 1. Admin: Assign Vehicle to Driver ---
router.post('/create', async (req, res) => {
    const { vehicleId, driverId } = req.body;
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(
            vehicleId, 
            { assignedDriver: driverId, status: 'Assigned' }, 
            { new: true }
        );

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.json({ message: "Driver assigned successfully", vehicle });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- 2. Dashboard Overview ---
router.get('/all', async (req, res) => {
    try {
        const assignments = await Vehicle.find({ assignedDriver: { $ne: null } })
            .populate('assignedDriver', 'name email');
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 3. CANCEL ASSIGNMENT ---
router.put('/cancel/:vehicleId', async (req, res) => {
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.vehicleId,
            { assignedDriver: null, status: 'Available' },
            { new: true }
        );
        
        if (!updatedVehicle) return res.status(404).json({ message: "Vehicle not found" });
        
        res.json({ message: "Assignment cancelled successfully", vehicle: updatedVehicle });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4. Driver: View my assigned vehicle ---
router.get('/my-vehicle/:driverId', async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ assignedDriver: req.params.driverId });
        if (!vehicle) return res.status(404).json({ message: "No vehicle assigned" });
        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;