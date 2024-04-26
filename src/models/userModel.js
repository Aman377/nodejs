const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    mobileNo: Number
})

module.exports = mongoose.model('users', userSchema)