const asyncHandler = require("express-async-handler");
const Department = require("../models/departmentModel");

// Create new department
const createDepartment = asyncHandler(async (req, res) => {
    const { departmentId, departmentName } = req.body;

    // Validation
    if (!departmentId || !departmentName) {
        return res.status(400).json({
            error: 'Please fill all the required fields',
            success: false
        });
    }

    const departmentIdExists = await Department.findOne({ departmentId });
    if (departmentIdExists) {
        return res.status(400).json({
            error: 'Department ID already exists',
            success: false
        });
    }

    const departmentNameExists = await Department.findOne({ departmentName });
    if (departmentNameExists) {
        return res.status(400).json({
            error: 'Department name already exists',
            success: false
        });
    }

    // Create new department
    const department = await Department.create({
        departmentId,
        departmentName,
    });

    if (department) {
        const { _id } = department;
        return res.status(201).json({
            message: 'Department created successfully',
            success: true,
            data: { _id, departmentId, departmentName }
        });
    } else {
        return res.status(400).json({
            error: "Invalid department data",
            success: false
        });
    }
});

// Read all departments
const showDepartment = asyncHandler(async (req, res) => {
    const departments = await Department.find();
    if (departments.length > 0) {
        return res.status(200).json({
            success: true,
            data: departments
        });
    } else {
        return res.status(404).json({
            error: "No department records found",
            success: false
        });
    }
});

// Read specific department
// const searchDepartment = asyncHandler(async (req, res) => {
//     const { departmentId } = req.body;

//     if (!departmentId) {
//         return res.status(400).json({
//             error: "Department ID is required to search",
//             success: false
//         });
//     }

//     const search = await Department.findOne({ departmentId });

//     if (search) {
//         return res.status(200).json({
//             message: "Department found",
//             success: true,
//             data: search
//         });
//     } else {
//         return res.status(404).json({
//             error: "No department found with the given department ID",
//             success: false
//         });
//     }
// });

// Update department
const updateDepartment = asyncHandler(async (req, res) => {
    const department = await Department.findOne(req.params);

    if (department) {
        department.departmentId = req.body.departmentId || department.departmentId;
        department.departmentName = req.body.departmentName || department.departmentName;

        await department.save();

        return res.status(200).json({
            message: 'Department updated successfully',
            success: true
        });
    } else {
        return res.status(404).json({
            error: 'Cannot find the department with the given ID',
            success: false
        });
    }
});

// Delete department
const deleteDepartment = asyncHandler(async (req, res) => {
    const result = await Department.deleteOne(req.body);

    if (result.deletedCount > 0) {
        return res.status(200).json({
            message: "Department deleted successfully",
            success: true
        });
    } else {
        return res.status(404).json({
            error: 'No department found with the provided data',
            success: false
        });
    }
});

module.exports = {
    createDepartment,
    showDepartment,
    // searchDepartment,
    updateDepartment,
    deleteDepartment
};
