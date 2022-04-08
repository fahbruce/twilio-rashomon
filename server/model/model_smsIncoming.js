const mongoose = require('mongoose');

var smsIncoming = new mongoose.Schema({
    telDest:{
        type: String,
        required: true
    },
    telExp:{
        type: String,
        required: true
    },
    messageIn:{
        type: String,
        required: true
    },
    dateIn:{
        type: String,
        required: true
    },
    /*idUser:{
        type: String,
        required: true
    },*/
    status:{
        type: Number,
        required: true
    }
})


const SmsIncoming = mongoose.model('smsIncoming', smsIncoming);

module.exports = SmsIncoming;