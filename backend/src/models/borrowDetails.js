const { model, Schema } = require('mongoose');

const BorrowDetailsModel = model(
    "borrowDetails",
    new Schema({ 
        borrower: { type: Schema.Types.ObjectId, ref: "users" }, 
        borrowerName: String,
        status: { type: String, default: 'requested' },
        borrowedOn: String, 
        returnedOn: String
    })
)

module.exports = { BorrowDetailsModel}