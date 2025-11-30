const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventory.controller");
const { authenticate, authorize } = require("../middleWars/auth.middlewar");

// Add item to inventory
router.post("/add",authenticate,authorize('admin'), inventoryController.addInventoryItem);

// Get all inventory items for a pharmacy
router.get("/pharmacy/:pharmacyId",authenticate,authorize('admin'), inventoryController.getInventoryByPharmacy);

// Get all pharmacies that have a specific medicine
router.get("/medicine/:medicineId", inventoryController.getPharmaciesWithMedicine);

// Update an inventory item
router.put("/update/:inventoryId",authenticate,authorize('admin'), inventoryController.updateInventory);

module.exports = router;
