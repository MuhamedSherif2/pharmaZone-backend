import Pharmacy from "../models/pharmacy.model.js";

// ==============================
// Add Pharmacy
// ==============================
export const addPharmacy = async (req, res) => {
  try {
    const { name, isOpen24h, startTime, endTime, location } = req.body;

    // userId should come from authenticated user
    const userId = req.user._id;

    if (
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid location coordinates are required",
      });
    }

    const pharmacy = await Pharmacy.create({
      userId,
      name,
      isOpen24h,
      startTime,
      endTime,
      location: {
        type: "Point",
        coordinates: location.coordinates, // [lng, lat]
        address: location.address,
      },
    });

    res.status(201).json({
      success: true,
      message: "Pharmacy created successfully",
      data: pharmacy,
    });
  } catch (error) {
    console.error("Error adding pharmacy:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Pharmacies (not deleted)
// ==============================

export const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ isDeleted: false })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pharmacies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Pharmacy By ID
// ==============================
export const getPharmacyById = async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const pharmacy = await Pharmacy.findOne({
      _id: pharmacyId,
      isDeleted: false,
    }).populate("userId", "name email");

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Pharmacy
// ==============================
export const updatePharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const updateData = req.body;

    const pharmacy = await Pharmacy.findOneAndUpdate(
      { _id: pharmacyId, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    );

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pharmacy updated successfully",
      data: pharmacy,
    });
  } catch (error) {
    console.error("Error updating pharmacy:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Soft Delete Pharmacy
// ==============================
export const deletePharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const pharmacy = await Pharmacy.findOneAndUpdate(
      { _id: pharmacyId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pharmacy deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting pharmacy:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Restore Pharmacy
// ==============================
export const restorePharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const pharmacy = await Pharmacy.findOneAndUpdate(
      { _id: pharmacyId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found or already restored",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pharmacy restored successfully",
      data: pharmacy,
    });
  } catch (error) {
    console.error("Error restoring pharmacy:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Nearby Pharmacies (Geo)
// ==============================
export const getNearbyPharmacies = async (req, res) => {
  try {
    const { longitude, latitude, distance = 5000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "Longitude and latitude are required",
      });
    }

    const pharmacies = await Pharmacy.find({
      isDeleted: false,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(distance), // meters
        },
      },
    });

    res.status(200).json({
      success: true,
      data: pharmacies,
    });
  } catch (error) {
    console.error("Error fetching nearby pharmacies:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
