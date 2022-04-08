const mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
    fileContact:{
        type: String,
        required: true
    },
    idUser:{
        type: String,
        required: true
    }
})


const Contactdb = mongoose.model('Contactdb', contactSchema);

module.exports = Contactdb;