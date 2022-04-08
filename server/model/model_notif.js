const mongoose = require('mongoose');

var notifSMS = new mongoose.Schema({
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
   /* idUser:{
        type: String,
        required: true
    },*/
    oldStatus:{
        type: Number,
        required: true
    },
    newStatus:{
        type: Number,
        required: true
    }
})


const NotifSMS = mongoose.model('notifSMS', notifSMS);

module.exports = NotifSMS;