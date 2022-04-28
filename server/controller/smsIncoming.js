const express = require('express');
const SmsIncoming = require('../model/model_smsIncoming');

const MessagingResponse = require('twilio').twiml.MessagingResponse;
const app = express();

const dotenv = require('dotenv');

/**
 * @description Liste des SMS INCOMING
 */
 exports.countSMSIncoming = (req, res) => {
    const rec_numTelUser = req.query.numTelUser;

    SmsIncoming.find({telDest:rec_numTelUser, status:"1"}).sort({"dateIn":-1})
              .then(data => {
                  if(!data){
                      res.status(404).send({
                          message : "sms non trouvé!"
                      })
                  }else{
                      res.send(data);
                  }
              })
              .catch(err => {
                  res.status(500).send({
                      message: "Erreur lors de la récupération sms avec l'identifiant :"
                  })
              })
  } 

/**
 * @description Liste des SMS INCOMING
 */
 exports.findSMSIncoming = (req, res) => {
    
    //SmsIncoming.find().sort({"dateIn":-1})
    SmsIncoming.find().sort({"_id":-1})
            .then(data => {
                if(!data){
                    res.status(404).send({
                        message : "sms non trouvé!"
                    })
                }else{
                    res.send(data);
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Erreur lors de la récupération sms avec l'identifiant :"
                })
            })
  } 

/**
 * @description Liste des SMS INCOMING IN AJAX
 */
 exports.findSMSIncomingAjax = (req, res) => {

    var rec_telUser = req.query.numTelUser

    SmsIncoming.find({telDest: rec_telUser}).sort({"_id":-1})
            .then(data => {
                if(!data){
                    res.status(404).send({
                        message : "sms non trouvé!"
                    })
                }else{
                    res.send(data);
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Erreur lors de la récupération sms"
                })
            })
  } 

// modification ou mise à jour SMS Incoming
exports.updateSmsIncoming = (req, res) => {
    const id = req.params.id;
    const status = 0;

    SmsIncoming.findByIdAndUpdate(id, {status: status}, {useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    message: "La modification SMS Incoming avec l'" +id + "a été échoué!"
                })
            }else{
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "La modification n'est pas effectuée"
            })
        })
}

/**
 * @description GET SMS IN TWILIO "jsAJAX"
 *//*
 exports.findSMSStoryAjax = (req, res) => {
    const rec_accountS = process.env.TWILIO_ACCOUNT_SID;
    const rec_authS = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(rec_accountS, rec_authS);
 
   client.messages.list(function(err, data) {
        res.setHeader('Content-Type', 'application/json');
        const jsonContent = JSON.stringify(data);
        return res.send(jsonContent);
    });
    
  } */

  /**
 * @description Liste des messages bdd
 */
 exports.findSMSStoryAjax = (req, res) => {
    SmsIncoming.find().sort({"_id":-1})
            .then(data => {
                if(!data){
                    res.status(404).send({
                        message : "sms non trouvé!"
                    })
                }else{
                    res.send(data);
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Erreur lors de la récupération sms"
                })
            })
} 