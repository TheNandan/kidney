const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Model = mongoose.model

const date = new Date

const PredictedOn = date.toLocaleString('en-US',{
    day:'2-digit',
    month : 'short',
    hour : '2-digit',
    minute : '2-digit'
})

const historySchema = new Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    result :{ 
        type : String,
        required : true
    },
    PredictedOn : {
        type : String,
        required : true,
        default : PredictedOn
    }
})

const History = Model('history',historySchema)

module.exports = History