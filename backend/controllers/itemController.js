const asyncHandler = require("express-async-handler");
const Items = require("../models/itemModel");

// Create a new item
const createItem = asyncHandler(async (req, res) => {
    const { item_id, item_name, item_type, department_id } = req.body;

    // Validation
    if (!item_id || !item_name || !item_type) {
        return res.status(400).json({
            error: "Please provide all required fields.",
            success: false
        });
    }

    // Create new item
    const item = await Items.create({
        item_id,
        item_name,
        item_type,
        department_id
    });

    if (item) {
        return res.status(201).json({
            message: "Item created successfully",
            success: true,
            data: item
        });
    } else {
        return res.status(400).json({
            error: "Invalid item data.",
            success: false
        });
    }
});

// Read all items
const getAllItems = asyncHandler(async (req, res) => {
    const items = await Items.find();
    if (items.length > 0) {
        return res.status(200).json({
            success: true,
            data: items
        });
    } else {
        return res.status(404).json({
            error: "No items found.",
            success: false
        });
    }
});

// // Read specific item by ID
// const getItemById = asyncHandler(async (req, res) => {
//     const item = await Items.findById(req.params._id);
//     if (item) {
//         return res.status(200).json({
//             success: true,
//             data: item
//         });
//     } else {
//         return res.status(404).json({
//             error: "Item not found.",
//             success: false
//         });
//     }
// });

// Update an item
const updateItem = asyncHandler(async (req, res) => {
    const item = await Items.findById(req.params._id);

    if (item) {
        item.item_id = req.body.item_id || item.item_id;
        item.item_name = req.body.item_name || item.item_name;
        item.item_type = req.body.item_type || item.item_type;
        item.department_id = req.body.department_id || item.department_id;

        const updatedItem = await item.save();

        return res.status(200).json({
            message: "Item updated successfully",
            success: true,
            data: updatedItem
        });
    } else {
        return res.status(404).json({
            error: "Item not found.",
            success: false
        });
    }
});

// Delete an item
const deleteItem = asyncHandler(async (req, res) => {
    const item = await Items.findById(req.params._id);
    if (item) {
        await item.deleteOne();
        return res.status(200).json({
            message: "Item deleted successfully.",
            success: true
        });
    } else {
        return res.status(404).json({
            error: "Item not found.",
            success: false
        });
    }
});

module.exports = {
    createItem,
    getAllItems,
    // getItemById,
    updateItem,
    deleteItem
};
