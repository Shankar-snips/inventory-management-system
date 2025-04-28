const asyncHandler = require("express-async-handler");
const ConsumableStockBook = require("../models/consumableStockBookModel");

// Create new entry
const createConsumableStockBook = asyncHandler(async (req, res) => {
    const { billno, billDate, firmName, quantity, rate, totalAmount, storekeeperId, date, indentNo, givenTo, quantityGiven, balance } = req.body;

    // Validation
    if (!billno || !billDate || !firmName || !quantity || !rate || !totalAmount || !storekeeperId || !date || !indentNo || !givenTo || !quantityGiven || !balance) {
        res.status(400)
            .json({
                error: "Please fill all the required fields",
                success: false
            })
    }

    // Check if the entry with a same bill number already exists
    const billAlreadyExist = await ConsumableStockBook.findOne({ billno });
    if (billAlreadyExist) {
        res.status(400)
            .json({
                error: "Bill already exists",
                success: false
            })
    }

    // create new entry
    const consumableStockBook = await ConsumableStockBook.create({
        billno,
        billDate,
        firmName,
        quantity,
        rate,
        totalAmount,
        storekeeperId,
        date,
        indentNo,
        givenTo,
        quantityGiven,
        balance

    })

    if (consumableStockBook) {

        res.status(201)
            .json({
                message: "Entry created successfully",
                success: true
            })
    }
});

// read the all entries
const readConsumableStockBook = asyncHandler(async (req, res) => {
    const consumableStockBook = await ConsumableStockBook.find();
    if (consumableStockBook.length > 0) {
        res.status(200).json({ consumableStockBook })
    } else {
        res.status(400).json({
            error: 'No consumable stock records found',
            success: false
        })
    }

});

// Search for single entry using bill no.
// const searchConsumableStockBook = asyncHandler(async (req, res) => {
//     const { billno } = req.body;
//     const search = await ConsumableStockBook.findOne({ billno })
//     if (search) {
//         res.status(200).json(search);
//     } else {
//         res.status(404);
//         throw new Error("No data found with the given billno");
//     }
// });


// Update the entries
const updateConsumableStockBook = asyncHandler(async (req, res) => {
    const search = await ConsumableStockBook.findOne(req.params);
    if (search) {
        const { billno, billDate, firmName, quantity, rate, totalAmount, storekeeperId, date, indentNo, givenTo, quantityGiven, balance } = search;
        search.billno = req.body.billno || billno;
        search.billDate = req.body.billDate || billDate;
        search.firmName = req.body.firmName || firmName;
        search.quantity = req.body.quantity || quantity;
        search.rate = req.body.rate || rate;
        search.totalAmount = req.body.totalAmount || totalAmount;
        search.storekeeperId = req.body.storekeeperId || storekeeperId;
        search.date = req.body.date || date;
        search.indentNo = req.body.indentNo || indentNo;
        search.givenTo = req.body.givenTo || givenTo;
        search.quantityGiven = req.body.quantityGiven || quantityGiven;
        search.balance = req.body.balance || balance;

        const updatedCSB = await search.save()
        res.status(200).json({
            message: "Updated successfully",
            success: true
        })

    } else {
        res.status(400)
            .json({
                error: "Cannot find the entry with the given bill no",
                success: true
            })
    }
});

// Delete the entries
const deleteConsumableStockBook = asyncHandler(async (req, res) => {
    const deleteCSB = await ConsumableStockBook.deleteOne(req.body);
    if (deleteCSB) {
        res.status(200)
            .json({
                message: "Entry deleted successfully",
                success: true
            });
    } else {
        res.status(404)
            .json({
                error: "No record found for this bill number",
                success: false
            });
    };
});


module.exports = {
    createConsumableStockBook,
    readConsumableStockBook,
    // searchConsumableStockBook,
    updateConsumableStockBook,
    deleteConsumableStockBook
};