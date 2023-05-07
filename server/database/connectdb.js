URI = process.env.URI || 'mongodb://127.0.0.1:27017/'
DB = process.env.DB 

const mongoose = require('mongoose')
mongoose.set('strictQuery',true)

const connectDB = async() => {
    try {
        await mongoose.connect(URI,{
            dbName:DB
        }).then(
                console.log(`\n Connected with ${DB} database ...`)
        )
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB