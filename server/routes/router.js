const express = require('express');
const route = express.Router();

const controller = require('../controller/controller');

const services = require('../services/render');


/**
 * @description Root Route
 * @method GET /
 */
route.get('/', services.homeRoutes);
route.get('/connecter', services.loginRoutes);
route.get('/inscription', services.inscriptionRoutes);

//API Send SMS
route.post('/api/sendSms', controller.send)

//API USER
//route.post('/api/user', controller.authentificationController.js)

module.exports = route