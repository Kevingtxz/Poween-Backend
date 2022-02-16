const User = require('../models/user')

const company_owner = async (req, res, next) => {
    try {
        if (!req.user.company)
            throw new Error()
        next()
    } catch(e) {
        res.status(401).send({ error: 'You need a company to access it.'})
    }
}

module.exports = company_owner