const express = require("express");
const router = express.Router();
const { createStockEntry, getAllStockEntries, getStockEntryById, updateStockEntry, deleteStockEntry } = require("../controllers/stockBookToolsAndPlantsController");

// Define routes
router.post("/create", createStockEntry);
router.get("/read", getAllStockEntries);
// router.get("/search/:_id", getStockEntryById);
router.put("/update/:_id", updateStockEntry);
router.delete("/delete/:_id", deleteStockEntry);

module.exports = router;
