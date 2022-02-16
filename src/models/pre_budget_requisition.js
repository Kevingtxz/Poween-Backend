const mongoose = require('mongoose')

const preBudgetRequisitionSchema = new mongoose.Schema({
    average_bill: {
        type: Number,
        required: true,
        trim: true,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'City',
    },
    issuer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
},)

const PreBudgetRequisition = mongoose.model('PreBudgetRequisition', preBudgetRequisitionSchema)

module.exports = PreBudgetRequisition