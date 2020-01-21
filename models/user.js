var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: false,
        lowercase: true
    },
    password: {
        type: String
    }
})

module.exports = mongoose.model('User_Account', UserSchema)
