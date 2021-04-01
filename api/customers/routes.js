const controllers = require('./controllers.js');
const express = require('express');

const router = express.Router();

router.get('/', controllers.getCustomer);

router.post('/login', controllers.getCustomerByEmail);

//router.post('/login/password', controllers.getCustomerByPassword);

// router.put('/:email', controllers.update);

// router.delete('/:email', controllers.delete);

module.exports = router;
