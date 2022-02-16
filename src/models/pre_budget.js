const mongoose = require('mongoose')

const PreBudgetSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    value: {
        type: Number,
        required: true,
        trim: true,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'City',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    issuer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Company',
    },
}, {
    timestamps: true
},)

const PreBudget = mongoose.model('PreBudget', PreBudgetSchema)

module.exports = PreBudget