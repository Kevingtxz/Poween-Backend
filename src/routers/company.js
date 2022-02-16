const express = require('express')
const Company = require('../models/company')
const City = require('../models/city')
const auth = require('../middleware/auth')
const company_owner = require('../middleware/company_owner')
const { sendCompanyCreatedEmail, sendCompanyDeletedEmail, } = require('../utils/emails/account')
const router = new express.Router()

router.post('/newcompany', auth, async (req, res) => {
    try{
        const city = await City.findOne({ name: req.body.city })
        const company = Company({ 
            ...req.body,
            city: city._id,
            owner: req.user._id
        })
        req.user.company = company
        await req.user.save()
        await company.save()
        sendCompanyCreatedEmail(req.user.email, req.user.name, company.name)
        res.status(201).send(company)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/mycompany', auth, company_owner, async (req, res) => {
    try{
        const company = await Company.findById({ _id: req.user.company._id })

        if(!company)
            return res.status(404).send()
        
        res.send(company)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/mycompany', auth, company_owner, async (req, res) => {
    try {
        const company = await Company.findOneAndDelete({ user: req.user })
        
    
        if(!company)
            return res.status(404).send()

        sendCompanyDeletedEmail(req.user.email, req.user.name, company.name)
        res.send(company)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router