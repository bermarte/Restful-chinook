const controllers = require('./controllers.js');
const express = require('express');

const router = express.Router();

router.get('/', controllers.getAll);

router.get('/search/:id', controllers.getOne);

router.get('/search/:name', controllers.getOneByName);

router.post('/', controllers.create);

router.put('/:id', controllers.update);

router.delete('/:id', controllers.delete);

module.exports = router;
