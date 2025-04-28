const mongoose = require("mongoose");

const indentBookSchema = mongoose.Schema({
    equipmentFullDetail: {
        type: String,
        required: true
    },
    demandedQuantity: {
        type: Number
    },
    issuedQuantity: {
        type: Number
    },
    stockRegisterReference: {
        type: String
    },
    requester: {
        type: String
    },
    recipientId: {
        type: Number
    },
    principalApproved: {
        type: String
    },
    storekeeperId: {
        type: Number
    }
});

const IndentBook = mongoose.model('IndentBook', indentBookSchema);
module.exports = IndentBook;