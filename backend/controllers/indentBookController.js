const asyncHandler = require("express-async-handler");
const IndentBook = require("../models/indentBookModel");

// Create new indent book entry
const createIndentBook = asyncHandler(async (req, res) => {
    const {
        equipmentFullDetail,
        demandedQuantity,
        issuedQuantity,
        stockRegisterReference,
        requester,
        recipientId,
        principalApproved,
        storekeeperId
    } = req.body;

    // Validation
    if (
        !equipmentFullDetail ||
        !demandedQuantity ||
        !issuedQuantity ||
        !stockRegisterReference ||
        !requester ||
        !recipientId ||
        !principalApproved ||
        !storekeeperId
    ) {
        return res.status(400).json({
            error: "Please provide full equipment details.",
            success: false
        });
    }

    // Create new indent book entry
    const indentBook = await IndentBook.create({
        equipmentFullDetail,
        demandedQuantity,
        issuedQuantity,
        stockRegisterReference,
        requester,
        recipientId,
        principalApproved,
        storekeeperId
    });

    if (indentBook) {
        return res.status(201).json({
            message: "Indent book entry created successfully",
            success: true,
            data: indentBook
        });
    } else {
        return res.status(400).json({
            error: "Invalid indent book data.",
            success: false
        });
    }
});

// Read all indent book entries
const getAllIndentBooks = asyncHandler(async (req, res) => {
    const indentBooks = await IndentBook.find();
    if (indentBooks.length > 0) {
        return res.status(200).json({
            success: true,
            data: indentBooks
        });
    } else {
        return res.status(404).json({
            error: "No indent book records found.",
            success: false
        });
    }
});

// // Read specific indent book entry
// const getIndentBookById = asyncHandler(async (req, res) => {
//     const indentBook = await IndentBook.findById(req.params._id);
//     if (indentBook) {
//         return res.status(200).json({
//             success: true,
//             data: indentBook
//         });
//     } else {
//         return res.status(404).json({
//             error: "Indent book entry not found.",
//             success: false
//         });
//     }
// });

// Update indent book entry
const updateIndentBook = asyncHandler(async (req, res) => {
    const indentBook = await IndentBook.findById(req.params._id);

    if (indentBook) {
        indentBook.equipmentFullDetail = req.body.equipmentFullDetail || indentBook.equipmentFullDetail;
        indentBook.demandedQuantity = req.body.demandedQuantity || indentBook.demandedQuantity;
        indentBook.issuedQuantity = req.body.issuedQuantity || indentBook.issuedQuantity;
        indentBook.stockRegisterReference = req.body.stockRegisterReference || indentBook.stockRegisterReference;
        indentBook.requester = req.body.requester || indentBook.requester;
        indentBook.recipientId = req.body.recipientId || indentBook.recipientId;
        indentBook.principalApproved = req.body.principalApproved || indentBook.principalApproved;
        indentBook.storekeeperId = req.body.storekeeperId || indentBook.storekeeperId;

        const updatedIndentBook = await indentBook.save();

        return res.status(200).json({
            message: "Indent book entry updated successfully",
            success: true,
            data: updatedIndentBook
        });
    } else {
        return res.status(404).json({
            error: "Indent book entry not found.",
            success: false
        });
    }
});

// Delete indent book entry
const deleteIndentBook = asyncHandler(async (req, res) => {
    const indentBook = await IndentBook.findById(req.params._id);
    if (indentBook) {
        await indentBook.deleteOne();
        return res.status(200).json({
            message: "Indent book entry deleted successfully.",
            success: true
        });
    } else {
        return res.status(404).json({
            error: "Indent book entry not found.",
            success: false
        });
    }
});

module.exports = {
    createIndentBook,
    getAllIndentBooks,
    // getIndentBookById,
    updateIndentBook,
    deleteIndentBook
};
