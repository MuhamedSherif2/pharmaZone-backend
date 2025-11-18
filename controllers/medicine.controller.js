const Medicine = require("../models/medicine.model");
const Inventory = require("../models/inventory.model");
const Pharmacy = require("../models/pharmacy.model");
// addMedicine
exports.addMedicine = async (req, res) => {
  try {
    const { name, description, type, activeIngredient, image } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Medicine name is required" });
    }

    const medicine = new Medicine({
      name,
      description,
      type,
      activeIngredient,
      image,
    });

    await medicine.save();

    res.status(201).json({ success: true, data: medicine });
  } catch (error) {
    console.error("Error adding medicine:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// getAllMedicines
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ isDeleted: false });
    res.json({ success: true, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// Find nearest pharmacy with a specific medicine
exports.findNearestPharmacyWithMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const { userLat, userLong } = req.body;

    // Fetch inventory with populated pharmacy
    const inventories = await Inventory.find({
      medicine: medicineId,
      quantity: { $gt: 0 },
      isDeleted: false
    }).populate("pharmacy"); 

    if (!inventories.length) {
      return res.status(404).json({ message: "Medicine not available in any pharmacy" });
    }

    // Filter out any inventory without pharmacy or location
    const validInventories = inventories.filter(
      inv => inv.pharmacy && inv.pharmacy.location && inv.pharmacy.location.coordinates
    );

    if (!validInventories.length) {
      return res.status(404).json({ message: "No pharmacies with valid location found" });
    }

    // Compute distances
    const distances = validInventories.map(inv => {
      const pharmacy = inv.pharmacy;
      const [lng, lat] = pharmacy.location.coordinates;

      const distance = getDistance(userLat, userLong, lat, lng);

      return { pharmacy, distance };
    });

    // Sort by nearest
    distances.sort((a, b) => a.distance - b.distance);

    res.json({
      nearest: distances[0],
      all: distances
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}



// Update Medicine
exports.updateMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const updateData = req.body; // name, description, price, category, image, etc.

    // Check if medicine exists
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // Update fields
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      medicineId,
      updateData,
      { new: true } // return updated object
    );

    res.json({
      success: true,
      message: "Medicine updated successfully",
      data: updatedMedicine,
    });
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


