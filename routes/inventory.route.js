const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventory.controller");
const { authenticate, authorize } = require("../middleWars/auth.middlewar");

// Add item to inventory
router.post("/add",authenticate,authorize('pharmacy'), inventoryController.addInventoryItem);

// Get all inventory items for a pharmacy
router.get("/pharmacy/:pharmacyId",authenticate,authorize('pharmacy'), inventoryController.getInventoryByPharmacy);

// Get all pharmacies that have a specific medicine
router.get("/medicine/:medicineId", inventoryController.getPharmaciesWithMedicine);

// Update an inventory item
router.put("/update/:inventoryId",authenticate,authorize('pharmacy'), inventoryController.updateInventory);

router.get("/:inventoryId",authenticate,authorize("pharmacy"),inventoryController.getInventoryById);

router.delete("/:inventoryId",authenticate,authorize("pharmacy"),inventoryController.deleteInventoryItem);

router.patch("/:inventoryId/restore",authenticate,authorize("pharmacy"),inventoryController.restoreInventoryItem);


router.get("/",authenticate,authorize("admin"),inventoryController.getAllInventory);

module.exports = router;
