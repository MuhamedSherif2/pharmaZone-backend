const Medicine = require("../models/medicine.model");
const Inventory = require("../models/inventory.model");
const Pharmacy = require("../models/pharmacy.model");
// addMedicine
exports.addMedicine = async (req, res) => {
  try {
    const { name, image, description, details, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required"
      });
    }

    const medicine = await Medicine.create({
      name,
      image,
      description,
      details,
      category
    });

    res.status(201).json({
      success: true,
      data: medicine
    });

  } catch (error) {
    console.error("Error adding medicine:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// getAllMedicines
exports.getAllMedicines = async (req, res) => {
  try {
    const { pharmacyId } = req.query; // optional query param

    const medicines = await Medicine.find({ isDeleted: false })
      .populate("category")
      .sort({ createdAt: -1 });

    // If pharmacyId is provided, include price
    let data = medicines;
    if (pharmacyId) {
      data = await Promise.all(
        medicines.map(async (medicine) => {
          const inventory = await Inventory.findOne({
            medicine: medicine._id,
            pharmacy: pharmacyId,
            isDeleted: false
          });

          return {
            ...medicine.toObject(),
            price: inventory ? inventory.price : null,
            quantity: inventory ? inventory.quantity : 0
          };
        })
      );
    }

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMedicineById = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const { pharmacyId } = req.query; // optional query param

    const medicine = await Medicine.findOne({
      _id: medicineId,
      isDeleted: false
    }).populate("category");

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    let result = medicine.toObject();

    // Add price and quantity if pharmacyId is provided
    if (pharmacyId) {
      const inventory = await Inventory.findOne({
        medicine: medicineId,
        pharmacy: pharmacyId,
        isDeleted: false
      });

      result.price = inventory ? inventory.price : null;
      result.quantity = inventory ? inventory.quantity : 0;
    }

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Find nearest pharmacy with a specific medicine
exports.findNearestPharmacyWithMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const { userLat, userLong } = req.body;

    const inventories = await Inventory.find({
      medicineId,
      quantity: { $gt: 0 },
      isDeleted: false
    }).populate("pharmacyId");

    if (!inventories.length) {
      return res.status(404).json({
        success: false,
        message: "Medicine not available in any pharmacy"
      });
    }

    const validInventories = inventories.filter(
      inv =>
        inv.pharmacyId &&
        inv.pharmacyId.location &&
        inv.pharmacyId.location.coordinates
    );

    if (!validInventories.length) {
      return res.status(404).json({
        success: false,
        message: "No pharmacies with valid location found"
      });
    }

    const distances = validInventories.map(inv => {
      const [lng, lat] = inv.pharmacyId.location.coordinates;
      const distance = getDistance(userLat, userLong, lat, lng);

      return {
        pharmacy: inv.pharmacyId,
        price: inv.price,
        distance
      };
    });

    distances.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      nearest: distances[0],
      all: distances
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
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
    const updateData = req.body;

    const medicine = await Medicine.findOneAndUpdate(
      { _id: medicineId, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: medicine
    });

  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.deleteMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;

    const medicine = await Medicine.findOneAndUpdate(
      { _id: medicineId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.restoreMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;

    const medicine = await Medicine.findOneAndUpdate(
      { _id: medicineId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found or already restored"
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine restored successfully",
      data: medicine
    });

  } catch (error) {
    console.error("Error restoring medicine:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getDeletedMedicines = async (req, res) => {
  const medicines = await Medicine.find({ isDeleted: true });
  res.json({ success: true, data: medicines });
};




