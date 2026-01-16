const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const Trip = require("../models/Trip");

// --- 1. Add new Vehicle ---
router.post("/add", async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- 2. Get all vehicles ---
router.get("/all", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate(
      "assignedDriver",
      "name email"
    );
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 3. VEHICLE UPDATE (Edit Feature) ---

router.put("/update/:id", async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Taake updated data return ho
    );
    res.json(updatedVehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- 4. VEHICLE DELETE ---

router.delete("/delete/:id", async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 5. START TRIP ---
router.patch("/start-trip/:id", async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status: "On Trip" },
      { new: true }
    );

    const newTrip = new Trip({
      vehicleId: updatedVehicle._id,
      driverId: updatedVehicle.assignedDriver,
      startTime: new Date(),
      status: "Active",
    });
    await newTrip.save();

    res.json({ vehicle: updatedVehicle, trip: newTrip });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- 6. END TRIP ---
router.patch("/end-trip/:id", async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status: "Available" },
      { new: true }
    );

    await Trip.findOneAndUpdate(
      { vehicleId: req.params.id, status: "Active" },
      { endTime: new Date(), status: "Completed" },
      { new: true }
    );

    res.json(updatedVehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- 7. MAINTENANCE ---
router.patch("/maintenance/:id", async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status: "Maintenance", lastMaintenanceDate: new Date() },
      { new: true }
    );
    res.json(updatedVehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- 8. REPORTS ---
router.get("/reports/usage-history", async (req, res) => {
  try {
    const history = await Trip.find()
      .populate("vehicleId", "plateNumber model")
      .populate("driverId", "name email")
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
