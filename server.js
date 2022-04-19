const express = require('express');

/* new code login */
const session = require('express-session');
const exphbs = require('express-handlebars');
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

const connectDB= require('./server/database/connection');

const dotenv = require('dotenv');
const Userdb = require('./server/model/model');
const Contactdb = require('./server/model/model_contact');
const SmsIncoming = require('./server/model/model_smsIncoming');
const NotifSMS = require('./server/model/model_notif');

const MessagingResponse = require('twilio').twiml.MessagingResponse;


dotenv.config({path:'config.env'});
const PORT = process.env.PORT || 8080;

const upload = require('express-fileupload');

/********************************** */
/******* WebPush notification *******/
/********************************** */
const webpush = require('web-push');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
webpush.setVapidDetails('mailto:nt.peronnel@gmail.com', publicVapidKey, privateVapidKey);


const app = express();

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
    app.get('/',isLoggedIn , services.homeRoutes);
    app.get('/test', (req, res)=>{
        res.render('test');
    });
    app.get('/inscription',isLoggedIn, services.inscriptionRoutes);
    app.get('/lst-user', services.listUser);
    app.get('/up-user',isLoggedIn, services.updateUser);

    /********************************** */
    /************ Historiques **********/
    /********************************** */
    app.get('/api/list', (req,res)=>{
        const rec_accountS = process.env.TWILIO_ACCOUNT_SID;
        const rec_authS = process.env.TWILIO_AUTH_TOKEN;
        const client = require('twilio')(rec_accountS, rec_authS);

        client.messages.list(function(err, data) {
            data.forEach(function(message){
               //console.log(message);
            });
             return res.send(data);
        }); 
        return true;          
    });

    app.get('/api/list-ajax', smsIncomingController.findSMSStoryAjax)


    app.get('/api/find-chat-client', controller.findSms)
    
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

    const rec_accountS = process.env.TWILIO_ACCOUNT_SID;
    const rec_authS = process.env.TWILIO_AUTH_TOKEN;

    const client = require('twilio')(rec_accountS, rec_authS);

   if(number!= "" && messageC!="" ){
        client.messages
            .create({
                body: messageC, 
                from: numberExp,       
                to: number
            })
            .then(message => console.log(message.body));
            return res.redirect('/');
    }else{
        console.log("Veuillez remplir les champs nécessaires");
        return res.redirect('/');
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
    
        // Save contact dans la base de donnée
        contact.save(contact)
            .then(data => {
                //res.send(data)
                file.mv('./assets/uploads/' + filename, function (err){
                    if(err){
                        res.send(err)
                    }else{
                       // res.send("Fichier importé")
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
            dateIn: rec_dateIn,
            //idUser: rec_idUser,
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

        // Save Incoming SMS dans la base de donnée
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
                            console.log('création réussi!');
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
                          newStatus: _newStatus
                        }, {useFindAndModify: false})
                           .then(data => {
                               if(!data){
                                   //res.writeHead(200, {'Content-Type': 'text/xml'});
                                   console.log('echec');
                               }else{
                                   //res.writeHead(200, {'Content-Type': 'text/xml'});
                                   console.log('notif réussi');
                               }
                           })
                           .catch(err => {
                              // res.writeHead(200, {'Content-Type': 'text/xml'});
                               res.status(500).send({
                                   message: "La mise à jour n'est pas effectuée"
                               })
                           })
                   }
               })
               .catch(err => {
                   res.writeHead(200, {'Content-Type': 'text/xml'});
                   res.status(500).send({
                       message: "Erreur lors de la récupération sms avec l'identifiant :"
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
                message : "notification non trouvé!"
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
})

app.put('/api/up-notif/:id', (req, res) => {
    const id = req.params.id;

    NotifSMS.findByIdAndUpdate(id, {"oldStatus": 0, "newStatus": 0}, {useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    message: "La mise à jour notification a été échoué!"
                })
            }else{
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "La mise à jour n'est pas effectuée"
            })
        })
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
app.listen(PORT, () => {
    console.log('Server is runins on port 80');
});


module.exports = route
