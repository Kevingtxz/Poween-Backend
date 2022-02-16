const express = require('express')
const sharp = require('sharp')
const User = require('../models/user')
const City = require('../models/city')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../utils/emails/account')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const city = await City.findOne({ name: req.body.city })
    const user = User({
        ...req.body,
        city: city._id,
    })
    
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age',]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation)
        return res.status(400).send({ error: 'Invalid updates!' })

    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    await req.user.remove()
    try {
        // sendGoodbyeEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router