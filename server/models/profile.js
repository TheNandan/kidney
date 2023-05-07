const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Model = mongoose.model

const date = new Date

const updatedOn = date.toLocaleString('en-US',{
    day:'2-digit',
    month : 'short',
    hour : '2-digit',
    minute : '2-digit'
})

const profileSchema = new Schema({
    _id : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    profession : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    updatedOn : {
        type : String,
        required : true,
        default : updatedOn
    }
})

const Profile = Model('profile',profileSchema)

module.exports = Profile