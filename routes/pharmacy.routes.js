const express = require("express");
const router = express.Router();
const {addPharmacy,getAllPharmacies,getNearbyPharmacies} = require("../controllers/pharmacy.controller");
const { authenticate, authorize } = require("../middleWars/auth.middlewar");

// addPharmacy adminOnly 
router.post("/",authenticate,authorize('admin'), addPharmacy);
// getAllPharmacies
router.get("/", getAllPharmacies);
// getNearbyPharmacies
router.get("/nearby", getNearbyPharmacies);

module.exports = router;
