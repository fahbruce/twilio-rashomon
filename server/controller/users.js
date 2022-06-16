
var Userdb = require('../model/model');
const express = require('express');

/* new code login */
const session = require('express-session');
//const exphbs = require('express-handlebars');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

/* Fin new code login */


const bodyparser = require('body-parser');
const path = require('path');


const route = express.Router();

const app = express();

const dotenv = require('dotenv');
dotenv.config({path:'config.env'});

// Creation d'un utilisateur et enregistrement dans la base de donnée
exports.create = async (req, res) => {
    const role_ = req.body.roleUser;
    const email_ = req.body.email;
    const tel_ = req.body.tel;
    const password_ = req.body.password;

    // validation de la requette
    if(!req.body){
        res.status(400).send({
            message: "Le contenu ne peut pas être vide"
        });
        return;
    }

    const exists = await Userdb.exists({
        email: email_,
    })

    if (exists) {
       res.redirect('/lst-user');
       return;
    };

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password_, salt, function (err, hash){
            const newAdmin = new Userdb({
                email: email_,
                password: hash,
                role: role_,
                tel: tel_
            });
            newAdmin.save();
            res.redirect('/inscription');
        })
    })
}

// Rechercher tous les utilisateurs
exports.find = (req, res) => {
    if(req.query.id){
        const id =req.query.id

        Userdb.findById(id)
            .then(data => {
                if(!data){
                    res.status(404).send({
                        message : "Utilisateur non trouvé!"
                    })
                }else{
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Erreur lors de la récupération de l'utilisateur avec l'identifiant :" + id
                })
            })
    }else{
        Userdb.find()
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
    }
}

// modification ou mise à jour d'une utilisateur
exports.update = (req, res) => {
    if(!req.body){
       return res
                .status(400)
                .send({
                        message: "Le contenu ne peut pas être vide"
                    });
    }

    const id = req.params.id

    Userdb.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    message: "La modification d'utilisateur avec l'" +id + "a été échoué!"
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

// Suppression d'une utilisateur
exports.delete = (req, res) => {
    const id = req.params.id

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if(data){
                res.status(404).send({
                    message: "L'utilisateur a été bien supprimé"
                }) 
            }else{
                res.send({
                    message:"La suppression a échoué!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Impossible de supprimer l'utilisateur"
            })
        })
}
