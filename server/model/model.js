const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    tel:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    }
})


const Userdb = mongoose.model('userdb', userSchema);

module.exports = Userdb;