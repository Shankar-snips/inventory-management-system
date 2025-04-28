const express = require("express");
const router = express.Router();
const { createItem, getAllItems, getItemById, updateItem, deleteItem } = require("../controllers/itemController");

// Define routes
router.post("/create", createItem);
router.get("/read", getAllItems);
// router.get("/search/:_id", getItemById);
router.put("/update/:_id", updateItem);
router.delete("/delete/:_id", deleteItem);

module.exports = router;
