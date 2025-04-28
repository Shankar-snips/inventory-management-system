const asyncHandler = require("express-async-handler");
const StockBook = require("../models/stockBookToolsAndPlantsModel");

// Create a new stock entry
const createStockEntry = asyncHandler(async (req, res) => {
    const {
        itemName,
        dateReceived,
        receivedBy,
        quantityReceived,
        invoiceNumber,
        price,
        dateOfIssue,
        givenTo,
        givenQuantity,
        receiver,
        stockLeft,
        dateOfStoreReturn,
        returnedBy,
        totalDefectiveItems,
        statusOfUsage
    } = req.body;

    if (!itemName) {
        return res.status(400).json({
            error: "Item name is required.",
            success: false
        });
    }

    const stockEntry = await StockBook.create({
        itemName,
        dateReceived,
        receivedBy,
        quantityReceived,
        invoiceNumber,
        price,
        dateOfIssue,
        givenTo,
        givenQuantity,
        receiver,
        stockLeft,
        dateOfStoreReturn,
        returnedBy,
        totalDefectiveItems,
        statusOfUsage
    });

    if (stockEntry) {
        return res.status(201).json({
            message: "Stock entry created successfully",
            success: true,
            data: stockEntry
        });
    } else {
        return res.status(400).json({
            error: "Invalid stock book data.",
            success: false
        });
    }
});

// Read all stock entries
const getAllStockEntries = asyncHandler(async (req, res) => {
    const stockEntries = await StockBook.find();
    if (stockEntries.length > 0) {
        return res.status(200).json({
            success: true,
            data: stockEntries
        });
    } else {
        return res.status(404).json({
            error: "No stock records found.",
            success: false
        });
    }
});

// // Read specific stock entry by ID
// const getStockEntryById = asyncHandler(async (req, res) => {
//     const stockEntry = await StockBook.findById(req.params._id);
//     if (stockEntry) {
//         return res.status(200).json({
//             success: true,
//             data: stockEntry
//         });
//     } else {
//         return res.status(404).json({
//             error: "Stock entry not found.",
//             success: false
//         });
//     }
// });

// Update stock entry
const updateStockEntry = asyncHandler(async (req, res) => {
    const stockEntry = await StockBook.findById(req.params._id);

    if (stockEntry) {
        stockEntry.itemName = req.body.itemName || stockEntry.itemName;
        stockEntry.dateReceived = req.body.dateReceived || stockEntry.dateReceived;
        stockEntry.receivedBy = req.body.receivedBy || stockEntry.receivedBy;
        stockEntry.quantityReceived = req.body.quantityReceived || stockEntry.quantityReceived;
        stockEntry.invoiceNumber = req.body.invoiceNumber || stockEntry.invoiceNumber;
        stockEntry.price = req.body.price || stockEntry.price;
        stockEntry.dateOfIssue = req.body.dateOfIssue || stockEntry.dateOfIssue;
        stockEntry.givenTo = req.body.givenTo || stockEntry.givenTo;
        stockEntry.givenQuantity = req.body.givenQuantity || stockEntry.givenQuantity;
        stockEntry.receiver = req.body.receiver || stockEntry.receiver;
        stockEntry.stockLeft = req.body.stockLeft || stockEntry.stockLeft;
        stockEntry.dateOfStoreReturn = req.body.dateOfStoreReturn || stockEntry.dateOfStoreReturn;
        stockEntry.returnedBy = req.body.returnedBy || stockEntry.returnedBy;
        stockEntry.totalDefectiveItems = req.body.totalDefectiveItems || stockEntry.totalDefectiveItems;
        stockEntry.statusOfUsage = req.body.statusOfUsage || stockEntry.statusOfUsage;

        const updatedStockEntry = await stockEntry.save();

        return res.status(200).json({
            message: "Stock entry updated successfully",
            success: true,
            data: updatedStockEntry
        });
    } else {
        return res.status(404).json({
            error: "Stock entry not found.",
            success: false
        });
    }
});

// Delete stock entry
const deleteStockEntry = asyncHandler(async (req, res) => {
    const stockEntry = await StockBook.findById(req.params._id);
    if (stockEntry) {
        await stockEntry.deleteOne();
        return res.status(200).json({
            message: "Stock entry deleted successfully.",
            success: true
        });
    } else {
        return res.status(404).json({
            error: "Stock entry not found.",
            success: false
        });
    }
});

module.exports = {
    createStockEntry,
    getAllStockEntries,
    // getStockEntryById,
    updateStockEntry,
    deleteStockEntry
};
