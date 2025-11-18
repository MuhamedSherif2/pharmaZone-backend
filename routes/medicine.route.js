const express = require("express");
const router = express.Router();

const medicineController = require("../controllers/medicine.controller");

// Add new medicine
router.post("/add", medicineController.addMedicine);

// Get all medicines
router.get("/all", medicineController.getAllMedicines);

// Update medicine
router.put("/update/:medicineId", medicineController.updateMedicine);

// Find nearest pharmacy that has a specific medicine
router.post("/nearest/:medicineId", medicineController.findNearestPharmacyWithMedicine);

module.exports = router;
