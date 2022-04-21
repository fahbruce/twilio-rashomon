const axios = require('axios');
var Contactdb = require('../model/model_contact.js');

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
    axios.get('https://sms.rashomon-international.com/api/users')
        .then(function(response){
            res.render('listeUser', {users: response.data});
        })
        .catch(err => {
            res.send(err)
        })
   
}

exports.updateUser = (req, res)=>{
    // make a get request to api/users
    axios.get('https://sms.rashomon-international.com/api/users',{params: {id:req.query.id}})
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

    
    const req_story = axios.get('http://localhost:80/api/list');
    const req_inbox = axios.get('http://sms.rashomon-international.com/api/find-sms-incoming');
    const req_contact = axios.get('http://sms.rashomon-international.com/api/find-file');

    axios.all([
        req_story,
        req_inbox,
        req_contact
    ])

        .then(axios.spread((response1, response2, response3) => {
            res.render('index', {
                messages: response1.data,
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
    axios.get('https://sms.rashomon-international.com/api/find-file',{params: {id:req.query.id}})
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