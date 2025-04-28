const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    departmentId: {
        type: String,
        required: true,
        unique: true
    },
    departmentName: {
        type: String,
        required: true,
        unique: true
    },
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;