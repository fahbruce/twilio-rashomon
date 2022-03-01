const express = require('express');

const dotenv = require('dotenv');
dotenv.config({path:'config.env'});
const PORT = process.env.PORT || 8080;

const app = express();

app.get('/',(req, res)=>{
    res.send('bienvenue')
})

app.listen(PORT, () => {
    console.log('Server is runins on port 3001');
})