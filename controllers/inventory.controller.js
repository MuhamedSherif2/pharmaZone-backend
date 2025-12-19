import Inventory from "../models/inventory.model.js";

// Add item to inventory
export const addInventoryItem = async (req, res) => {
  try {
    const { pharmacy, medicine, quantity, price } = req.body;

    if (!pharmacy || !medicine || !price) {
      return res.status(400).json({ success: false, message: "Pharmacy, medicine, and price are required" });
    }

    const item = new Inventory({
      pharmacy,
      medicine,
      quantity,
      price,
    });

    await item.save();

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all inventory for a pharmacy
export const getInventoryByPharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const items = await Inventory.find({ pharmacy: pharmacyId, isDeleted: false })
      .populate("medicine");

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Find pharmacies that have a specific medicine
export const getPharmaciesWithMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;

    const items = await Inventory.find({ medicine: medicineId, quantity: { $gt: 0 }, isDeleted: false })
      .populate("pharmacy");

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Update Inventory (quantity, price, etc.)
export const updateInventory = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { quantity, price, isDeleted } = req.body;

    // Check if inventory exists
    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    // Update fields
    if (quantity !== undefined) inventory.quantity = quantity;
    if (price !== undefined) inventory.price = price;
    if (isDeleted !== undefined) inventory.isDeleted = isDeleted;

    inventory.updatedAt = Date.now();

    // Save updates
    await inventory.save();

    res.json({
      success: true,
      message: "Inventory updated successfully",
      data: inventory,
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getInventoryById = async (req, res) => {
  try {
    const { inventoryId } = req.params;

    const item = await Inventory.findOne({ _id: inventoryId, isDeleted: false })
      .populate("pharmacy")
      .populate("medicine");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found"
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//Get All Inventory Items Across All Pharmacies
export const getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find({ isDeleted: false })
      .populate("pharmacy")
      .populate("medicine")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const { inventoryId } = req.params;

    const item = await Inventory.findOneAndUpdate(
      { _id: inventoryId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const restoreInventoryItem = async (req, res) => {
  try {
    const { inventoryId } = req.params;

    const item = await Inventory.findOneAndUpdate(
      { _id: inventoryId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found or already restored"
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory item restored successfully",
      data: item
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
 

