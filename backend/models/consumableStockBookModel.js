const mongoose = require("mongoose");

const consumableStockBookSchema = mongoose.Schema({
    billno: {
        type: String,
        required: true,
        unique: true
    },
    billDate: {
        type: Date
    },
    firmName: {
        type: String
    },
    quantity: {
        type: Number
    },
    rate: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    storekeeperId: {
        type: Number
    },
    date: {
        type: Date
    },
    indentNo: {
        type: String
    },
    givenTo: {
        type: String
    },
    quantityGiven: {
        type: Number
    },
    balance: {
        type: Number
    }
},
    {
        timestamps: true,
    }
);

const ConsumableStockBook = mongoose.model('ConsumableStockBook', consumableStockBookSchema);

module.exports = ConsumableStockBook;