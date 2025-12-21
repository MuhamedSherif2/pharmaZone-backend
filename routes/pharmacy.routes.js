import express from "express";
const router = express.Router();
import {addPharmacy,getAllPharmacies,getNearbyPharmacies,getPharmacyById,updatePharmacy,deletePharmacy,
    restorePharmacy
} from "../controllers/pharmacy.controller.js";
import { authenticate, authorize } from "../middleWars/auth.middlewar.js";

// addPharmacy adminOnly 
router.post("/",authenticate,authorize('pharmacy'), addPharmacy);
// getAllPharmacies
router.get("/", getAllPharmacies);
router.get("/:pharmacyId",getPharmacyById);
// getNearbyPharmacies
router.get("/nearby", getNearbyPharmacies);
router.put("/:pharmacyId",authenticate,authorize('pharmacy'), updatePharmacy);
router.delete("/:pharmacyId",authenticate,authorize('pharmacy'), deletePharmacy);
router.patch("/restore/:pharmacyId",authenticate,authorize('pharmacy'), restorePharmacy);

export default router;
