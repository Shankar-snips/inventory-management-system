const express = require("express");
const { createConsumableStockBook, updateConsumableStockBook, readConsumableStockBook, deleteConsumableStockBook, searchConsumableStockBook } = require("../controllers/consumableStockBookController");
const router = express.Router();

router.post("/create", createConsumableStockBook);
router.get("/read", readConsumableStockBook);
// router.get("/search", searchConsumableStockBook);
router.put("/update/:billno", updateConsumableStockBook);
router.delete("/delete/:billno", deleteConsumableStockBook);

module.exports = router;