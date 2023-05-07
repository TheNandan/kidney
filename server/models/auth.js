const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Model = mongoose.model

const date = new Date

const today = date.toLocaleString('en-US',{
    day:'numeric',
    month:'short'
})

const time = date.toLocaleString('en-US',{
    hour:'2-digit',
    minute:'2-digit'
})

const authSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true,
        enum : ['user','admin'],
        default : 'user'
    },
    createdOn : { 
        type : String,
        required : true,
        default : today
    },
    createdAt : {
        type : String,
        required : true,
        default : time
    }

})

const auth = Model('auth',authSchema)

module.exports = auth