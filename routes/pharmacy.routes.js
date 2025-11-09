const express = require("express");
const router = express.Router();
const {addPharmacy,getAllPharmacies,getNearbyPharmacies} = require("../controllers/pharmacy.controller");

// addPharmacy adminOnly 
router.post("/", addPharmacy);
// getAllPharmacies
router.get("/", getAllPharmacies);
// getNearbyPharmacies
router.get("/nearby", getNearbyPharmacies);

module.exports = router;
