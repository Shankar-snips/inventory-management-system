const mongoose = require("mongoose");


const itemSchema = mongoose.Schema({
    item_id: {
        type: String,
        required: true
    },
    item_name: {
        type: String,
        required: true
    },
    item_type: {
        type: String,
        enum: ['property item', 'consumable item'],
        required: true
    },
    department_id: {
        type: String,
        ref: 'Department'
    }
});

const Items = mongoose.model("Items", itemSchema);

module.exports = Items;