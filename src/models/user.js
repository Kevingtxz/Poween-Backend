const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')
const PreBudgetRequisition = require('./pre_budget_requisition')
const PreBudget = require('./pre_budget')
const Company = require('./company')
require('./pre_budget_requisition')

const userSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password'))
                throw new Error('Password should have at least 6 length')
        },
    },
    // phones: [{
    //     phone: {
    //         ddd: {
    //             type: String,
    //             required: true,
    //             minlength: 2,
    //             maxlength: 2,
    //         },
    //         main_number: {
    //             type: String,
    //             required: true,
    //             minlength: 8,
    //             maxlength: 9,
    //         },
    //     },
    // },],
    city: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'City',
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        unique: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        },
    },],
}, {
    timestamps: true
},)

userSchema.virtual('pre_budgets_requisition', {
    ref: 'PreBudgetRequisition',
    localField: '_id',
    foreignField: 'issuer',
})

userSchema.virtual('pre_budgets', {
    ref: 'PreBudget',
    localField: '_id',
    foreignField: 'user',
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'ratãodeesgoto')
    
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token    
}

userSchema.statics.findByCredentials = async (email, password) =>{
    const user = await User.findOne({ email })

    if(!user)
        throw new Error('Unable to login')
    
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch)
        throw new Error('Unable to login')
    
    return user
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) 
        user.password = await bcrypt.hash(user.password, 8)

    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Company.deleteOne({ owner: user._id })
    await PreBudgetRequisition.deleteMany({ issuer: user._id })
    await PreBudget.deleteMany({ user: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User