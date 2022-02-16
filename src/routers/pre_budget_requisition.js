const express = require('express')
const auth = require('../middleware/auth')
const company_owner = require('../middleware/company_owner')
const { requestPreBudgets, } = require('../utils/pre_budget/pre_budget_events')
const City = require('../models/city')
const PreBudgetRequistion = require('../models/pre_budget_requisition')

const router = new express.Router()

router.post('/pre_budgets_requisition', auth, async (req, res) => {
    const city = await City.findOne({ name: req.body.city })

    const pre_budget_requistion = PreBudgetRequistion({ 
        ...req.body,
        city: city._id,
        issuer: req.user._id
    })

    try{
        await pre_budget_requistion.save()
        requestPreBudgets(pre_budget_requistion._id)
        res.status(201).send(pre_budget_requistion)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/pre_budgets_requisition', auth, async (req, res) => {
    try{
        await req.user.populate({
            path: 'pre_budgets_requisition',
            options: {
                limit: 1,
            },
        })
        res.send(req.user.pre_budgets_requisition)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/pre_budgets_requisition', auth, async (req, res) => {
    try {
        const pre_budget_requistion = await PreBudgetRequistion.findOneAndDelete({ issuer: req.user._id })

        if(!pre_budget_requistion)
            return res.status(404).send()

        res.send(pre_budget_requistion)
    } catch (e) {
        res.status(500).send()
    }
})

// router.get('/mycompany/pre_budgets_requisition', auth, async (req, res) => {
//     try{
//         await req.user.populate({
//             path: 'pre_budgets_requisition',
//             options: {
//                 limit: 1,
//             },
//         })
//         res.send(req.user.pre_budgets_requisition)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

module.exports = router