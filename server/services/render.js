const axios = require('axios');

exports.loginRoutes = (req, res)=>{
    res.render('login');
}

exports.inscriptionRoutes = (req, res)=>{
    res.render('inscription');
}

exports.homeRoutes = (req, res)=>{
    res.render('index');
    
   /* axios.get('http://localhost:3001/api/sms')
        .then(function(response){
            console.log(response);
            res.render('index');
        })
        .catch(err => {
            res.send('err');
        })*/
}