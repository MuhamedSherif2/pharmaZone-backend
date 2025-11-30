const express = require("express");
const router = express.Router();

const medicineController = require("../controllers/medicine.controller");
const { authenticate, authorize } = require("../middleWars/auth.middlewar");

// Add new medicine
router.post("/add",authenticate,authorize('admin'), medicineController.addMedicine);

// Get all medicines
router.get("/all",authenticate,authorize('admin'), medicineController.getAllMedicines);

// Update medicine
router.put("/update/:medicineId",authenticate,authorize('admin'), medicineController.updateMedicine);

// Find nearest pharmacy that has a specific medicine
router.post("/nearest/:medicineId", medicineController.findNearestPharmacyWithMedicine);

module.exports = router;
