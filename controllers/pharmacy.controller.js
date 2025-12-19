import Pharmacy from"../models/pharmacy.model.js";

// addPharmacy
export const addPharmacy = async (req, res) => {
  try {
    const {  isOpen24h, location } = req.body;
    // name, address, phone, email, password, workingHours,

    // Basic data verification
    if ( !location) {
      // !name || !address || !phone || !password ||
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    const pharmacy = new Pharmacy({
      // name,
      // address,
      // phone,
      // email,
      // password,
      // workingHours,
      isOpen24h,
      location,
    });

    await pharmacy.save();

    res.status(201).json({ success: true, data: pharmacy });
  } catch (error) {
    console.error("Error adding pharmacy:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// getAllPharmacies
export const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ isDeleted: false });
    res.json({ success: true, data: pharmacies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Find a nearby pharmacy based on coordinates
export const getNearbyPharmacies = async (req, res) => {
  try {
    const { longitude, latitude, distance = 5000 } = req.query; // distance 

    if (!longitude || !latitude) {
      return res.status(400).json({ success: false, message: "Coordinates are required" });
    }

    const pharmacies = await Pharmacy.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: parseFloat(distance),
        },
      },
    });

    res.json({ success: true, data: pharmacies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

