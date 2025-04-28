const asyncHandler = require("express-async-handler");
const SupplierItem = require("../models/supplierItemsModel");
const Supplier = require("../models/supplierModels");
const Item = require("../models/itemModel");

// Create a new supplier item
const createSupplierItem = asyncHandler(async (req, res) => {
    const { supplierId, item_id } = req.body;

    if (!supplierId || !item_id) {
        return res.status(400).json({
            error: "Please provide all required fields.",
            success: false
        });
    }

    // ✅ Validate supplierId exists based on supplierId field, not _id
    const existingSupplier = await Supplier.findOne({ supplierId });
    if (!existingSupplier) {
        return res.status(404).json({
            error: "Supplier not found with the given supplierId.",
            success: false
        });
    }

    // ✅ Validate item_id exists based on item_id field, not _id
    const existingItem = await Item.findOne({ item_id });
    if (!existingItem) {
        return res.status(404).json({
            error: "Item not found with the given item_id.",
            success: false
        });
    }

    // ✅ Save using supplierId and item_id
    const supplierItem = await SupplierItem.create({ supplierId, item_id });

    if (supplierItem) {
        return res.status(201).json({
            message: "Supplier item created successfully",
            success: true,
            data: supplierItem
        });
    } else {
        return res.status(400).json({
            error: "Invalid supplier item data.",
            success: false
        });
    }
});

// Read all supplier items
const getAllSupplierItems = asyncHandler(async (req, res) => {
    const supplierItems = await SupplierItem.find()
        .populate({
            path: "supplierId",
            localField: "supplierId",
            foreignField: "supplierId",
            model: "Supplier"
        })
        .populate({
            path: "item_id",
            localField: "item_id",
            foreignField: "item_id",
            model: "Items"
        });

    if (supplierItems.length > 0) {
        return res.status(200).json({
            success: true,
            data: supplierItems
        });
    } else {
        return res.status(404).json({
            error: "No supplier items found.",
            success: false
        });
    }
});

// // Read specific supplier item by ID
// const getSupplierItemById = asyncHandler(async (req, res) => {
//     const supplierItem = await SupplierItem.findById(req.params._id)
//         .populate("supplierId")
//         .populate("item_id");

//     if (supplierItem) {
//         return res.status(200).json({
//             success: true,
//             data: supplierItem
//         });
//     } else {
//         return res.status(404).json({
//             error: "Supplier item not found.",
//             success: false
//         });
//     }
// });

// Update a supplier item
const updateSupplierItem = asyncHandler(async (req, res) => {
    const supplierItem = await SupplierItem.findById(req.params._id);

    if (supplierItem) {
        supplierItem.supplierId = req.body.supplierId || supplierItem.supplierId;
        supplierItem.item_id = req.body.item_id || supplierItem.item_id;

        const updatedSupplierItem = await supplierItem.save();

        return res.status(200).json({
            message: "Supplier item updated successfully",
            success: true,
            data: updatedSupplierItem
        });
    } else {
        return res.status(404).json({
            error: "Supplier item not found.",
            success: false
        });
    }
});

// Delete a supplier item
const deleteSupplierItem = asyncHandler(async (req, res) => {
    const supplierItem = await SupplierItem.findById(req.params._id);

    if (supplierItem) {
        await supplierItem.deleteOne();
        return res.status(200).json({
            message: "Supplier item deleted successfully.",
            success: true
        });
    } else {
        return res.status(404).json({
            error: "Supplier item not found.",
            success: false
        });
    }
});

module.exports = {
    createSupplierItem,
    getAllSupplierItems,
    // getSupplierItemById,
    updateSupplierItem,
    deleteSupplierItem
};
