const mongoose = require("mongoose");

const stockBookSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    dateReceived: {
        type: Date
    },
    receivedBy: {
        type: String
    },
    quantityReceived: {
        type: Number
    },
    invoiceNumber: {
        type: String
    },
    price: {
        type: Number
    },
    dateOfIssue: {
        type: Date
    },
    givenTo: {
        type: String
    },
    givenQuantity: {
        type: Number
    },
    receiver: {
        type: String
    },
    stockLeft: {
        type: Number
    },
    dateOfStoreReturn: {
        type: Date
    },
    returnedBy: {
        type: String
    },
    totalDefectiveItems: {
        type: Number
    },
    statusOfUsage: {
        type: String
    }
});

const StockBook = mongoose.model("StockBook",stockBookSchema);
module.exports = StockBook;