const path = require('path');
const https = require('https');
const fs = require('fs');

let cert = fs.readFileSync(path.join('/etc/letsencrypt/live/camp.rashomon-international.com', 'cert.pem'));
let key = fs.readFileSync(path.join('/etc/letsencrypt/live/camp.rashomon-international.com', 'privkey.pem'));


const httpsAgent = new https.Agent({
  rejectUnauthorized: false, 
  cert: cert,
  key: key
 })

const axios = require('axios');
var Contactdb = require('../model/model_contact.js');
const dotenv = require('dotenv');
dotenv.config({path:'config.env'});

const HOST_ = process.env.URL_HOST;

console.log(HOST_);

// Date
const moment = require('moment');
moment.suppressDeprecationWarnings = true;

exports.loginRoutes = (req, res)=>{
    let response = {
        title: "login",
        error: req.query.error
    }
    res.render('login', response);
}

exports.inscriptionRoutes = (req, res)=>{
    res.render('inscription');
}

exports.listUser = (req, res)=>{
    // make a get request to api/users
    axios.get(HOST_+'/api/users', { httpsAgent })
        .then(function(response){
            res.render('listeUser', {users: response.data});
        })
        .catch(err => {
            res.send(err)
        })
   
}

exports.updateUser = (req, res)=>{
    // make a get request to api/users
    axios.get(HOST_+'/api/users',{params: {id:req.query.id}, httpsAgent})
    .then(function(userData){
        res.render('update_', {user: userData.data});
    })
    .catch(err => {
        res.send(err);
    })
   
}
exports.homeRoutes = (req, res)=>{
    const rec_my_number = req.user.tel;
    const rec_my_mail = req.user.email;
    const rec_id = req.user._id;    
    const rec_role = req.user.role;    


    //const req_story = axios.get(HOST_+'/api/list');
    const req_inbox = axios.get(HOST_+'/api/find-sms-incoming', { httpsAgent });
    const req_contact = axios.get(HOST_+'/api/find-file',{ httpsAgent });

	//const req_inbox = axios.get(HOST_+'/api/find-sms-incoming',{ httpsAgent }).then(response => response.data).catch(err => console.error(err));

    axios.all([
        //req_story,
        req_inbox,
        req_contact
    ]).then(axios.spread((response2,response3) => {
            res.render('index', {
                inbox: response2.data,
                contact: response3.data,
                tel: rec_my_number,
                mail: rec_my_mail,
                id: rec_id,
                role: rec_role,
                moment: moment
            });
        }))
        .catch(err => {
            res.send("Erreur");
        })
}


exports.contact = (req, res)=>{
    // make a get request to api/users
    axios.get('/api/find-file',{params: {id:req.query.id}, httpsAgent})
    .then(function(contact){
        res.render('index', {user: contact.data});
    })
    .catch(err => {
        res.send(err);
    })
   
}

exports.index_ = (req, res)=>{
    res.render('index_');
}
