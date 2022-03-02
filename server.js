const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path:'config.env'});
const PORT = process.env.PORT || 8080;

const app = express();

app.use(bodyparser.urlencoded({extended:true}))

app.set("view engine", "ejs");
//app.set("views", path.resolve(__dirname,"views/ejs"));

//load routers
app.use('/', require('./server/routes/router'));

//load assets
app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/img',express.static(path.resolve(__dirname,"assets/img")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))

app.listen(PORT, () => {
    console.log('Server is runins on port 3001');
})