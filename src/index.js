require('./db/mongoose.js')
const express = require('express')
const cors = require('cors')
const userRouter = require('./routers/user')
const preBudgetRouter = require('./routers/pre_budget')
const preBudgetRequisitionRouter = require('./routers/pre_budget_requisition')
const companyRouter = require('./routers/company')

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(preBudgetRouter)
app.use(preBudgetRequisitionRouter)
app.use(companyRouter)

const City = require('./models/city')

app.post('/cities', async (req, res) => {
    const city = City(req.body)

    try{
        await city.save()
        res.status(201).send(city)
    } catch(e) {
        res.status(400).send(e)
    }
})

app.listen(port, () => {
    console.log(`Server listing on port ${port}`)
})