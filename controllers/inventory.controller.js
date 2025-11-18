const Inventory = require("../models/inventory.model");

// Add item to inventory
exports.addInventoryItem = async (req, res) => {
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
exports.getInventoryByPharmacy = async (req, res) => {
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
exports.getPharmaciesWithMedicine = async (req, res) => {
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
exports.updateInventory = async (req, res) => {
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
