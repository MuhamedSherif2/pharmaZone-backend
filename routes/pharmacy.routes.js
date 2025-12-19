import express from "express";
const router = express.Router();
import {addPharmacy,getAllPharmacies,getNearbyPharmacies} from "../controllers/pharmacy.controller.js";
import { authenticate, authorize } from "../middleWars/auth.middlewar.js";

// addPharmacy adminOnly 
router.post("/",authenticate,authorize('pharmacy'), addPharmacy);
// getAllPharmacies
router.get("/", getAllPharmacies);
// getNearbyPharmacies
router.get("/nearby", getNearbyPharmacies);

export default router;
