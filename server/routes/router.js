const express = require('express');
const route = express.Router();

const controller = require('../controller/controller');
const usersController = require('../controller/users');
const contactController = require('../controller/upload_contact');

const services = require('../services/render');

const uploadController = require('../controller/upload_contact');


//API USER
//route.post('/api/user', controller.authentificationController.js)
route.post('/api/users', usersController.create)
route.get('/api/users', usersController.find)
route.put('/api/users/:id', usersController.update)
route.delete('/api/users/:id', usersController.delete)


//route.post('/api/create-contact', contactController.createContact)

module.exports = route