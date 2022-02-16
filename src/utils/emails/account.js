const sgMail = require('@sendgrid/mail')
const res = require('express/lib/response')
const User = require('../../models/user')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    // sgMail.send({
    //     to: email,
    //     from: 'poween.app@gmail.com',
    //     subject: 'Thanks for joining in!',
    //     text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
    // })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'poween.app@gmail.com',
        subject: 'Goodbye',
        text: `Thank you ${name}, we will miss you here.`,
    })
}

const sendCompanyCreatedEmail = (email, name, company_name) => {
    sgMail.send({
        to: email,
        from: 'poween.app@gmail.com',
        subject: `Hi ${name}, ${company_name} was created`,
        text: `Text...`,
    })
    try{
    } catch(e) {
        throw new Error()
    }
}

const sendCompanyDeletedEmail = (email, name, company_name) => {
    try{
        sgMail.send({
            to: email,
            from: 'poween.app@gmail.com',
            subject: `Hi ${name}, your company: ${company_name} was deleted`,
            text: `Text...`,
        })
    } catch(e) {
        throw new Error()
    }
}

const sendPreBudgetEmail = (email, name, company_name, value, text) => {
    try{
        sgMail.send({
            to: email,
            from: 'poween.app@gmail.com',
            subject: `Hi ${name}, new pre budget from the ${company_name} - R$${value/100}`,
            text: `${text}\n\nCompany: ${company_name}`,
        })
    } catch(e) {
        throw new Error()
    }
    
}

const sendPreBudgetRequisitionEmail = (email, average_bill, user_name, user_email, link) => {
    sgMail.send({
        to: email,
        from: 'poween.app@gmail.com',
        subject: `Hi, there is a new pre budget requisition in your city`,
        text: `Hi\nthe client ${user_name} is waiting for your budget, feel free to send email\nemail: ${user_email}\naverage bill: ${average_bill}\n${link}`,
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail,
    sendPreBudgetEmail,
    sendPreBudgetRequisitionEmail,
    sendCompanyCreatedEmail,
    sendCompanyDeletedEmail,
}