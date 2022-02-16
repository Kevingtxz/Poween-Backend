const mongoose = require('mongoose')

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
}, {
    timestamps: true
},)

citySchema.virtual('pre_budget_requisitions', {
    ref: 'PreBudgetRequisition',
    localField: '_id',
    foreignField: 'city',
})

citySchema.virtual('companies', {
    ref: 'Company',
    localField: '_id',
    foreignField: 'city',
})

const City = mongoose.model('City', citySchema)

module.exports = City