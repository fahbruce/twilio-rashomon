const express = require('express');
const route = express.Router();

const dotenv = require('dotenv');
dotenv.config({path:'config.env'});

/**
 * @description Liste des messages filtrés
 */
exports.findSms = (req, res) => {
    const rec_accountS = process.env.TWILIO_ACCOUNT_SID;
    const rec_authS = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(rec_accountS, rec_authS);
        
    client.messages.list(function(err, data){       
             data.forEach(function(message){
            });
            res.setHeader('Content-Type', 'application/json');
            const jsonContent = JSON.stringify(data);
            return res.send(jsonContent);
        })
        .then(messages => messages.forEach(/*m => console.log(m.sid)*/));

    return true;
} 
