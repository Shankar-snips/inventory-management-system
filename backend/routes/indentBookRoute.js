const express = require("express");
const router = express.Router();
const { createIndentBook, getAllIndentBooks, getIndentBookById, updateIndentBook, deleteIndentBook } = require("../controllers/indentBookController");


router.post("/create", createIndentBook);
router.get("/read", getAllIndentBooks);
// router.get("/search/:_id", getIndentBookById);
router.put("/update/:_id", updateIndentBook);
router.delete("/delete/:_id", deleteIndentBook);

module.exports = router;
