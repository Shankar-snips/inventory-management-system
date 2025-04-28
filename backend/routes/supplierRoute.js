const express = require("express");
const router = express.Router();
const { createSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier } = require("../controllers/supplierController");

// Define routes
router.post("/create", createSupplier);
router.get("/read", getAllSuppliers);
// router.get("/search/:supplierId", getSupplierById);
router.put("/update/:supplierId", updateSupplier);
router.delete("/delete/:supplierId", deleteSupplier);

module.exports = router;
