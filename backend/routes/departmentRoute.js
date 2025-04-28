const express = require("express");
const { createDepartment, showDepartment, updateDepartment, deleteDepartment, searchDepartment } = require("../controllers/departmentController");
const router = express.Router();

router.post("/create", createDepartment);
router.get("/read", showDepartment);
// router.get("/search", searchDepartment);
router.put("/update/:departmentId", updateDepartment);
router.delete("/delete/:departmentId", deleteDepartment);

module.exports = router;