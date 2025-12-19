import express from "express";
const router = express.Router();

import {
    addMedicine,
    getAllMedicines,
    updateMedicine,
    findNearestPharmacyWithMedicine,
    getDeletedMedicines,
    getMedicineById,
    deleteMedicine,
    restoreMedicine
}from "../controllers/medicine.controller.js";
import { authenticate, authorize } from "../middleWars/auth.middlewar.js";

// Add new medicine
router.post("/add",authenticate,authorize('admin'), addMedicine);

// Get all medicines
// /all?pharmacyId=123
router.get("/all",authenticate,authorize('pharmacy'), getAllMedicines);

// Update medicine
router.put("/update/:medicineId",authenticate,authorize('admin'), updateMedicine);

// Find nearest pharmacy that has a specific medicine
router.post("/nearest/:medicineId", findNearestPharmacyWithMedicine);

router.get("/deleted",authenticate,authorize("admin"),getDeletedMedicines);

// /:medicineId?pharmacyId=123
router.get("/:medicineId", getMedicineById);

router.delete("/:medicineId",authenticate,authorize("admin"),deleteMedicine);

router.patch("/:medicineId/restore",authenticate,authorize("admin"),restoreMedicine);



export default router;
