const { sendPreBudgetRequisitionEmail, } = require('../emails/account')
const Company = require('../../models/company')
const PreBudgetRequisition = require('../../models/pre_budget_requisition')
const User = require('../../models/user')

const requestPreBudgets = async (pre_budget_requistion_id) => {
    try{
        const pre_budget_requistion = await PreBudgetRequisition.findById(pre_budget_requistion_id)
        const user = await User.findById(pre_budget_requistion.issuer)
        const companies = await Company.find({ city: pre_budget_requistion.city })
        if(companies)
            companies.forEach(e => {
                sendPreBudgetRequisitionEmail(e.email, pre_budget_requistion.average_bill, user.name, user.email, process.env.CONNECTION_URL+'/mycompany/pre_budget/requisition/'+pre_budget_requistion_id)
            })
    } catch(e) {
        throw new Error('Pre budget requisition failed')
    }
    
}

module.exports = {
    requestPreBudgets,
}