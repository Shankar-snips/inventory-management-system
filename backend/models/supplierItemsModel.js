const mongoose = require("mongoose");


const supplierItemSchema = mongoose.Schema({
    supplierId: {
        type: String,
        ref: 'Supplier',
        required: true
    },
    item_id: {
        type: String,
        ref: 'Items',
        required: true
    }
});

const SuppplierItem = mongoose.model("SupplierItem", supplierItemSchema);

module.exports = SuppplierItem;