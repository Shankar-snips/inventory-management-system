const mongoose = require("mongoose");

const supplierSchema = mongoose.Schema({
    supplierId: {
        type: String,
        required: true,
        unique: true
    },
    supplierName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gstIn: {
        type: String,
        required: true,
        unique: true
    },
    pincode: {
        type: String,
        required: true
    },
    validFrom: {
        type: Date,
        required: [true, "please add valid from date"],
        default: Date.now()
    },
    validTo: {
        type: Date,
        required: [true, "please add valid to date"],
        default: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
},
    {
        timestamps: true,
    }
);

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;