const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const errorHandler = require('errorhandler')
const mongoose = require('mongoose')
const dbUrl = 'mongodb://localhost:27017/accounting';

const app = express()
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(errorHandler())

let Accounts = mongoose.model('Accounts', {
    name: String,
    balance: Number
})

app.get('/accounts', (req, res) => {
    mongoose.connect(dbUrl)
    Accounts.find((error, result) => {
        mongoose.disconnect()
        if(error) res.send(error)
        res.send(result)
    })
})
app.post('/accounts', (req, res) => {
    mongoose.connect(dbUrl)
    let accountModel = new Accounts(req.body)
    accountModel.save((error, result) => {
        mongoose.disconnect()
        if(error) res.send(error)
        res.send(result)
    })
})
app.post('/accounts/:id', (req, res) => {
    if(!req.body.balance) return res.sendStatus(400)
    mongoose.connect(dbUrl)
    Accounts.findById(req.params.id, (error, result) => {
        if(error) {
            mongoose.disconnect()
            res.send(error)
        }
        else {
            result.balance = req.body.balance
            result.save((error, resultDoc) => {
                mongoose.disconnect()
                if(error) res.send(error)
                res.send(result)
            })
        }
    })
})
app.delete('/accounts/:id', (req, res) => {
    mongoose.connect(dbUrl)
    Accounts.findById(req.params.id, (error, result) => {
        if(error) {
            mongoose.disconnect()
            res.send(error)
        }
        else {
            result.remove((error, resultDoc) => {
                mongoose.disconnect()
                if(error) res.send(error)
                res.send(result)
            })
        }
    })
})

app.listen(3000)