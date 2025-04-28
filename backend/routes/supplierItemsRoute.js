const express = require("express");
const router = express.Router();
const { createSupplierItem, getAllSupplierItems, getSupplierItemById, updateSupplierItem, deleteSupplierItem } = require("../controllers/supplierItemsController");

// Define routes
router.post("/create", createSupplierItem);
router.get("/read", getAllSupplierItems);
// router.get("/search/:_id", getSupplierItemById);
router.put("/update/:_id", updateSupplierItem);
router.delete("/delete/:_id", deleteSupplierItem);

module.exports = router;
