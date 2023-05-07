
require('dotenv').config()

PORT = process.env.PORT
SECRET = process.env.SECRET

const express = require('express')
const morgan = require('morgan')
const path = require('path')
const bodyparser = require('body-parser')
const session = require('express-session')
const connectDB = require('./server/database/connectdb')
const app = express()


app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.static('profile'))
app.use(express.static('uploads'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(morgan('tiny'))
app.use(session({
    secret:SECRET,
    resave:false,
    saveUninitialized:true
}))
app.use( (req,res,next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})
app.use( (req,res,next) => {
    res.locals.result = req.session.result
    delete req.session.result
    next()
})
app.use('/css',express.static(path.join(__dirname,'node_modules','bootstrap','dist','css')))
app.use('/js',express.static(path.join(__dirname,'node_modules','bootstrap','dist','js')))
app.use('/js',express.static(path.join(__dirname,'node_modules','jquery','dist')))

app.use('/',require('./server/routers/routes'))


connectDB().then(
    app.listen(PORT, async() => {
        console.log(` server @ http://127.0.0.1:${PORT} ...\n`)
    })
).catch( error => {
    console.log(error)
})