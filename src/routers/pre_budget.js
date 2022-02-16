const express = require('express')
const City = require('../models/city')
const PreBudget = require('../models/pre_budget')
const User = require('../models/user')
const Company = require('../models/company')
const auth = require('../middleware/auth')
const company_owner = require('../middleware/company_owner')
const { sendPreBudgetEmail, } = require('../utils/emails/account')
const router = new express.Router()

router.post('/mycompany/pre_budgets/:user_id', auth, company_owner, async (req, res) => {
    const city = await City.findOne({ name: req.body.city })
    const user = await User.findById(req.params.user_id)
    const company = await Company.findById(req.user.company)
    const pre_budget = PreBudget({ 
        ...req.body,
        city: city._id,
        user,
        issuer: req.user.company._id,
    })
    await pre_budget.save()
    sendPreBudgetEmail(user.email, user.name, company.name, req.body.value, req.body.text)
    try{
        res.status(201).send(pre_budget)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/mycompany/pre_budgets', auth, company_owner, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        const company = await Company.findById(req.user.company)
        await company.populate({
            path: 'pre_budgets',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            },
        })
        res.send(company.pre_budgets)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/mycompany/pre_budgets/:id', auth, company_owner, async (req, res) => {
    const _id = req.params.id

    try{
        const pre_budgets = await PreBudget.findOne({ _id, issuer: req.user.company._id })

        if(!pre_budgets)
            return res.status(404).send()

        res.send(pre_budgets)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/mycompany/pre_budgets/:id', auth, company_owner, async (req, res) => {
    const _id = req.params.id

    try {
        const pre_budgets = await PreBudget.findOneAndDelete({ _id, owner: req.user.company._id })

        if(!pre_budgets)
            return res.status(404).send()

        res.send(pre_budgets)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router