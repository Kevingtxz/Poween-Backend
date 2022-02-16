const mongoose = require('mongoose')
const validator = require('validator')

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value))
                throw new Error('Email is invalid')
        },
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'City',
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true,
    },
}, {
    timestamps: true,
},)

companySchema.virtual('pre_budgets', {
    ref: 'PreBudget',
    localField: '_id',
    foreignField: 'issuer',
})

companySchema.pre('remove', async function (next) {
    const company = this
    await PreBudget.deleteOne({ issuer: company._id })
    next()
})

const Company = mongoose.model('Company', companySchema)

module.exports = Company