const express = require('express');

/* new code login */
const session = require('express-session');
//const exphbs = require('express-handlebars');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const socket = require('socket.io');

const services = require('./server/services/render');
const controller = require('./server/controller/controller');
const uploadController = require('./server/controller/upload_contact');
const smsIncomingController = require('./server/controller/smsIncoming');

const axios = require('axios');
const route = express.Router();

/* Fin new code login */

const bodyparser = require('body-parser');
const path = require('path');
const XLSX = require('xlsx');

const connectDB= require('./server/database/connection');

const dotenv = require('dotenv');
const Userdb = require('./server/model/model');
const Contactdb = require('./server/model/model_contact');
const SmsIncoming = require('./server/model/model_smsIncoming');
const NotifSMS = require('./server/model/model_notif');

const MessagingResponse = require('twilio').twiml.MessagingResponse;


dotenv.config({path:'config.env'});
const PORT = process.env.PORT || 443;
const HOST_ = process.env.URL_HOST;
const IP_ = process.env.HOST_IP

const upload = require('express-fileupload');

/********************************** */
/******* WebPush notification *******/
/********************************** */
/*const webpush = require('web-push');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
webpush.setVapidDetails('mailto:nt.peronnel@gmail.com', publicVapidKey, privateVapidKey);
*/

const https = require('https');
const app = express();
const fs = require('fs');

//mongodb connection
connectDB();

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(upload());

app.set("view engine", "ejs");

//load routers
app.use('/', require('./server/routes/router'));

//load assets
app.use('/css',express.static(path.resolve(__dirname,"assets/css")));
app.use('/img',express.static(path.resolve(__dirname,"assets/img")));
app.use('/js',express.static(path.resolve(__dirname,"assets/js")));
app.use('/vendor',express.static(path.resolve(__dirname,"assets/vendor")));
app.use('/fonts',express.static(path.resolve(__dirname,"assets/fonts")));
app.use('/uploads',express.static(path.resolve(__dirname,"assets/uploads")));
app.use('/sound',express.static(path.resolve(__dirname,"assets/sound")));
app.use('/reportings',express.static(path.resolve(__dirname,"assets/reportings")));


/* new code login */
    app.use(session({
        secret: "verygoodsecret",
        resave : false,
        saveUninitialized: true
    }));

    app.use(express.json());

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done){
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done){
        //setup user model
        Userdb.findById(id, function(err, user){
            done(err, user);
        });
    })

    // search user in BDD
    passport.use(new localStrategy(function(email, password, done){
        Userdb.findOne({email: email}, function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, {message:"Incorrect username"});
            }

            bcrypt.compare(password, user.password, function(err, res){
                if(err){
                    return done(err);
                }
                if(res === false){
                    return done(null, false, {message:"Incorrect password"});
                }
                return done(null, user);
            })
        })
    }))

    // function login
    function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/login');
    }

    // login access
    app.get('/', isLoggedIn,services.homeRoutes);
    app.get('/inscription', services.inscriptionRoutes);
    app.get('/lst-user', services.listUser);
    app.get('/up-user', services.updateUser);

    /********************************** */
    /************ Historiques **********/
    /********************************** */
    app.get('/api/list', (req,res)=>{
        const rec_accountS = process.env.TWILIO_ACCOUNT_SID;
        const rec_authS = process.env.TWILIO_AUTH_TOKEN;
        const client = require('twilio')(rec_accountS, rec_authS);

        client.messages.list(function(err, data) {
            res.setHeader('Content-Type', 'application/json');
            const jsonContent = JSON.stringify(data);
            return res.end(jsonContent);
        });          
    });

    app.get('/api/list-ajax', smsIncomingController.findSMSStoryAjax)


    app.get('/api/find-chat-client', controller.findSms)
    app.get('/api/find-chat', controller.findSmsBdd)
    
    app.get('/api/find-file/', uploadController.findFile)

    // function logout
    function isLoggedOut(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        res.redirect('/');
    }

    // if user logged, page login blocked
    app.get('/login',isLoggedOut, services.loginRoutes);

    // logout session
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/login');
    })

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login?error=true'
    }));


/********************************** */
/******* API Send SMS twilio ********/
/********************************** */
app.post('/api/sendSms', (req,res)=>{
    /********************************** */
    /* Access && token du compte twilio */
    /********************************** */

    if(!req.body){
        res.status(400).send({
            message: 'Content can not be empty!'
        });
        return;
    }

    const number = req.body.numTel;
    const numberExp = req.body.numTelExp;
    const messageC = req.body.messageContent;
    var rec_dateIn = new Date();

    const rec_accountS = process.env.TWILIO_ACCOUNT_SID;
    const rec_authS = process.env.TWILIO_AUTH_TOKEN;

    const client = require('twilio')(rec_accountS, rec_authS);

   if(number!= "" && messageC!="" ){
        const smsIncoming = new SmsIncoming({
            telDest: number,
            telExp: numberExp,
            messageIn: messageC,
            direction: "outbound-api",
            tit: numberExp,
            dateIn: rec_dateIn,
            status: "0"
        });

        smsIncoming.save(smsIncoming)
            .then(data => {   
                console.log("Message save");
            })
            .catch(err => 
                res.status(500).send({
                    message: "Erreur d'enregistrement"
                })
            );

        client.messages
            .create({
                body: messageC, 
                from: numberExp,       
                to: number
            })
            .then(message => console.log(message.body));
            const twiml = new MessagingResponse();
            res.setHeader('Content-Type', 'text/xml');
            res.end(twiml.toString());
            //return res.redirect('/');
    }else{
        console.log("Veuillez remplir les champs n??cessaires");
        const twiml = new MessagingResponse();
        res.setHeader('Content-Type', 'text/xml');
        res.end(twiml.toString());
        //return res.redirect('/');
    }

})


/********************************** */
/********** UPLOAD CONTACT **********/
/********************************** */
app.post('/api/upload', (req, res) => {
    var rec_idUser = req.user._id;

    if (!req.files) {
        return res.status(200).json({ // Worked
          status_code: 0,
          error_msg: "Require Params Missing",
        });
      }
  
    if(req.files){
        var file = req.files.file;
        var filename = rec_idUser + Date.now() +'_' + file.name;

        const contact = new Contactdb({
            idUser: rec_idUser,
            fileContact: filename,
        })
    
        // Save contact dans la base de donn??e
        contact.save(contact)
            .then(data => {
                //res.send(data)
                file.mv('./assets/uploads/' + filename, function (err){
                    if(err){
                        res.send(err)
                    }else{
                       // res.send("Fichier import??")
                        return res.redirect('/');
                    }
                })
                
            })
            .catch(err => 
                res.status(500).send({
                    message: err.message
                }))
       
    }
    //console.log(req.files);
 })

/******************************************* */
/********** SAVE AND GET SMS INCOMING ********/
/******************************************* */
app.get('/api/find-sms-incoming/', smsIncomingController.findSMSIncoming)
app.get('/api/find-sms-incoming-ajax/', smsIncomingController.findSMSIncomingAjax)
app.get('/api/count-sms-incoming/', smsIncomingController.countSMSIncoming)


app.post('/api/sms-incoming', (req, res) => {
    var rec_telDest = req.body.To; // Consultant
    var rec_telExp = req.body.From; // Client
    var rec_messageIn = req.body.Body;
    var rec_direction = "inbound";
    var rec_tit = req.body.To;
    var rec_dateIn = new Date();
    var rec_status = 1;

    // recuperation data requette ajax

    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
        return;
    }

    if(req.body){
        const smsIncoming = new SmsIncoming({
            telDest: rec_telDest,
            telExp: rec_telExp,
            messageIn: rec_messageIn,
            direction: rec_direction,
            dateIn: rec_dateIn,
            tit: rec_tit,            
            status: rec_status
        });

        const notifSMS = new NotifSMS({
            telDest: rec_telDest,
            telExp: rec_telExp,
            messageIn: rec_messageIn,
            dateIn: rec_dateIn,
            //idUser: rec_idUser,
            oldStatus:0,
            newStatus:1
        });   

        // Save Incoming SMS dans la base de donn??e
        smsIncoming.save(smsIncoming)
            .then(data => {
                 //////////////////////////////////////////////
                // Find if notification exist or not exist //
                //////////////////////////////////////////////
               NotifSMS.find({"telDest": rec_telDest})
               .then(data => {
                   if(data==""){
                       notifSMS.save(notifSMS)
                           .then(dataNotif => {
                            console.log('cr??ation r??ussi!');
                           })
                           .catch(err => 
                               res.status(500).send({
                                   message: err.message
                               })
                           )
                       console.log("notif not exist");
                   }else{
                       const id = data[0]._id;
                       const _newStatus = data[0].newStatus + 1;

                      NotifSMS.findByIdAndUpdate(id, {
                          messageIn: rec_messageIn, 
                          dateIn: rec_dateIn,
                          newStatus: _newStatus,
                          telExp: rec_telExp
                        }, {useFindAndModify: false})
                           .then(data => {
                               if(!data){
                                   console.log('echec');
                               }
                           })
                           .catch(err => {
                               res.status(500).send({
                                   message: "La mise ?? jour n'est pas effectu??e"
                               })
                           })
                   }
               })
               .catch(err => {
                   res.writeHead(200, {'Content-Type': 'text/xml'});
                   res.status(500).send({
                       message: "Erreur lors de la r??cup??ration sms avec l'identifiant :"
                   })
                   res.end(err);
               })    
            })
            .catch(err => 
                res.status(500).send({
                    message: "Erreur d'enregistrement"
                })
            );
        }


        const twiml = new MessagingResponse();
        res.setHeader('Content-Type', 'text/xml');
        res.end(twiml.toString());
        console.log("save incoming");

       // console.log(req);
})


app.put('/api/up-sms-incoming/:id', smsIncomingController.updateSmsIncoming)

app.get('/api/get-notif', (req, res) => {
    const idT = req.query.telUser;

    NotifSMS.find({"telDest": idT})
    .then(data => {
        if(!data){
            res.status(404).send({
                message : "notification non trouv??!"
            })
        }else{
            res.send(data)
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Erreur lors de la r??cup??ration de l'utilisateur avec l'identifiant :" + id
        })
    })
})

app.put('/api/up-notif/:id', (req, res) => {
    const id = req.params.id;

    NotifSMS.findByIdAndUpdate(id, {"oldStatus": 0, "newStatus": 0}, {useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    message: "La mise ?? jour notification a ??t?? ??chou??!"
                })
            }else{
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "La mise ?? jour n'est pas effectu??e"
            })
        })
})

app.get('/export-data', (req, res) => {
     var rec_telDest = req.query.numTel;

    SmsIncoming.find({tit: rec_telDest}).sort({"_id":-1})
            .then(data => {
                console.log(rec_telDest);
                console.log(data);
                if(!data){
                    res.status(404).send({
                        message : "sms non trouv??!"
                    })
                }else{
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Erreur lors de la r??cup??ration sms"
                })
            })
})


app.post('/api/export-data', (req, res) => {
    var wb = XLSX.utils.book_new();
    var rec_DateSent = req.query.DateSent;
    var rec_Destinataire = req.query.Destinataire;
    var rec_Expediteur = req.query.Expediteur;
    var rec_Message = req.query.Message;

   var data = [
       {
           Date: rec_DateSent,
           Destinataire: rec_Destinataire,
           Expediteur: rec_Expediteur,
           Message: rec_Message
       }
   ]

   console.log(data);
    var rec_telDest = "+33757912827";
    var temp = JSON.stringify(data);
    temp = JSON.parse(temp);
    var ws = XLSX.utils.json_to_sheet(temp);
    var down = __dirname+'/assets/reportings/export.xlsx'
    XLSX.utils.book_append_sheet(wb, ws, "sheet1");
    XLSX.writeFile(wb, down);
    res.download(down);
})


/********************************** */
/********* PAGE NOT FOUND ***********/
/********************************** */

// Handling non matching request from the client
app.use((req, res, next) => {
    res.render('404');
})

/********************************** */
/******* RUN SERVER ********/
/********************************** */
/*app.listen(PORT, () => {
    
});*/
/*
app.listen({
    host: '51.77.244.245',
    port: PORT
});*/

const sslServer = https.createServer({
        key: fs.readFileSync(path.join('/etc/letsencrypt/live/camp.rashomon-international.com', 'privkey.pem')),
        cert: fs.readFileSync(path.join('/etc/letsencrypt/live/camp.rashomon-international.com', 'cert.pem')),
}, app)

sslServer.listen({
    host: IP_,
    port: PORT
}, () => console.log('server run with port : ' + PORT));


module.exports = route
