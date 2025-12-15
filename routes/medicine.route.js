const express = require("express");
const router = express.Router();

const medicineController = require("../controllers/medicine.controller");
const { authenticate, authorize } = require("../middleWars/auth.middlewar");

// Add new medicine
router.post("/add",authenticate,authorize('admin'), medicineController.addMedicine);

// Get all medicines
// /all?pharmacyId=123
router.get("/all",authenticate,authorize('pharmacy'), medicineController.getAllMedicines);

// Update medicine
router.put("/update/:medicineId",authenticate,authorize('admin'), medicineController.updateMedicine);

// Find nearest pharmacy that has a specific medicine
router.post("/nearest/:medicineId", medicineController.findNearestPharmacyWithMedicine);

router.get("/deleted",authenticate,authorize("admin"),medicineController.getDeletedMedicines);

// /:medicineId?pharmacyId=123
router.get("/:medicineId", medicineController.getMedicineById);

router.delete("/:medicineId",authenticate,authorize("admin"),medicineController.deleteMedicine);

router.patch("/:medicineId/restore",authenticate,authorize("admin"),medicineController.restoreMedicine);



module.exports = router;
