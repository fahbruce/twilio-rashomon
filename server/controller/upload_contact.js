const express = require('express');
const upload = require('express-fileupload');
var Contactdb = require('../model/model_contact');
var Userdb = require('../model/model');

const csv = require('csv-parser');
const fs = require('fs');
const results = [];

const session = require('express-session');
const passport = require('passport');

const app = express();
app.use(upload());

// Upload fichier.CSV
exports.uploadContact = (req, res) => {
   if(req.files){
       console.log(req.files);
   }
   //console.log(req.files);
   return true;
}


/**
 * @description Liste des CONTACT
 */
exports.findFile = (req, res) => {

  const path_file = "assets/uploads/";
  const rec_file = path_file + "liste_contact.csv";

  console.log(req.body);

  Contactdb.find()
            .then(data => {
                if(!data){
                    res.status(404).send({
                        message : "Contact non trouvé!"
                    })
                }else{
                    res.send(data);
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Erreur lors de la récupération du contact avec l'identifiant :"
                })
            })
} 