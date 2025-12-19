import express from "express";
const router = express.Router();

import { 
  addInventoryItem,
  getInventoryByPharmacy,
  getPharmaciesWithMedicine,
  updateInventory,
  getInventoryById,
  deleteInventoryItem,
  restoreInventoryItem,
  getAllInventory
} from "../controllers/inventory.controller.js"; 

import { authenticate, authorize } from "../middleWars/auth.middlewar.js";

// Add item to inventory
router.post("/add",authenticate,authorize('pharmacy'), addInventoryItem);

// Get all inventory items for a pharmacy
router.get("/pharmacy/:pharmacyId",authenticate,authorize('pharmacy'), getInventoryByPharmacy);

// Get all pharmacies that have a specific medicine
router.get("/medicine/:medicineId", getPharmaciesWithMedicine);

// Update an inventory item
router.put("/update/:inventoryId",authenticate,authorize('pharmacy'), updateInventory);

router.get("/:inventoryId",authenticate,authorize("pharmacy"),getInventoryById);

router.delete("/:inventoryId",authenticate,authorize("pharmacy"),deleteInventoryItem);

router.patch("/:inventoryId/restore",authenticate,authorize("pharmacy"),restoreInventoryItem);


router.get("/",authenticate,authorize("admin"),getAllInventory);

export default router;