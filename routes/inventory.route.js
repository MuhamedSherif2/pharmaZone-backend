const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventory.controller");

// Add item to inventory
router.post("/add", inventoryController.addInventoryItem);

// Get all inventory items for a pharmacy
router.get("/pharmacy/:pharmacyId", inventoryController.getInventoryByPharmacy);

// Get all pharmacies that have a specific medicine
router.get("/medicine/:medicineId", inventoryController.getPharmaciesWithMedicine);

// Update an inventory item
router.put("/update/:inventoryId", inventoryController.updateInventory);

module.exports = router;
