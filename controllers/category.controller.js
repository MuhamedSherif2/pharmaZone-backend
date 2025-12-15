const Category = require("../models/Category.js");

exports.createCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Name and imageUrl are required"
      });
    }

    const category = await Category.create({
      name,
      imageUrl
    });

    res.status(201).json({
      success: true,
      data: category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { name, imageUrl },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.restoreCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find deleted category and restore it
    const category = await Category.findOneAndUpdate(
      { _id: categoryId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or already restored"
      });
    }

    res.status(200).json({
      success: true,
      message: "Category restored successfully",
      data: category
    });

  } catch (error) {
    console.error("Error restoring category:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


