const asyncHandler = require("express-async-handler");
const Supplier = require("../models/supplierModels");

// Create a new Supplier
const createSupplier = asyncHandler(async (req, res) => {
    const { supplierId, supplierName, address, gstIn, pincode, validFrom, validTo } = req.body;

    if (!supplierId || !supplierName || !address || !gstIn || !pincode) {
        return res.status(400).json({
            error: "Please provide all required fields.",
            success: false
        });
    }

    const existingSupplier = await Supplier.findOne({ supplierId });
    if (existingSupplier) {
        return res.status(400).json({
            error: "Supplier with this ID already exists.",
            success: false
        });
    }

    const supplier = await Supplier.create({
        supplierId,
        supplierName,
        address,
        gstIn,
        pincode,
        validFrom,
        validTo
    });

    if (supplier) {
        return res.status(201).json({
            message: "Supplier created successfully",
            success: true,
            data: supplier
        });
    } else {
        return res.status(400).json({
            error: "Invalid supplier data.",
            success: false
        });
    }
});

// Read all Suppliers
const getAllSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find();

    if (suppliers.length > 0) {
        return res.status(200).json({
            success: true,
            data: suppliers
        });
    } else {
        return res.status(404).json({
            error: "No suppliers found.",
            success: false
        });
    }
});

// // Read a Supplier by ID
// const getSupplierById = asyncHandler(async (req, res) => {
//     const supplier = await Supplier.findOne({ supplierId: req.params.supplierId });

//     if (supplier) {
//         return res.status(200).json({
//             success: true,
//             data: supplier
//         });
//     } else {
//         return res.status(404).json({
//             error: "Supplier not found.",
//             success: false
//         });
//     }
// });

// Update a Supplier
const updateSupplier = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findOne({ supplierId: req.params.supplierId });

    if (supplier) {
        supplier.supplierName = req.body.supplierName || supplier.supplierName;
        supplier.address = req.body.address || supplier.address;
        supplier.gstIn = req.body.gstIn || supplier.gstIn;
        supplier.pincode = req.body.pincode || supplier.pincode;
        supplier.validFrom = req.body.validFrom || supplier.validFrom;
        supplier.validTo = req.body.validTo || supplier.validTo;

        const updatedSupplier = await supplier.save();

        return res.status(200).json({
            message: "Supplier updated successfully",
            success: true,
            data: updatedSupplier
        });
    } else {
        return res.status(404).json({
            error: "Supplier not found.",
            success: false
        });
    }
});

// Delete a Supplier
const deleteSupplier = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findOne({ supplierId: req.params.supplierId });

    if (supplier) {
        await supplier.deleteOne();
        return res.status(200).json({
            message: "Supplier deleted successfully.",
            success: true
        });
    } else {
        return res.status(404).json({
            error: "Supplier not found.",
            success: false
        });
    }
});

module.exports = {
    createSupplier,
    getAllSuppliers,
    // getSupplierById,
    updateSupplier,
    deleteSupplier
};
