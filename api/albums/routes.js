const controllers = require('./controllers.js');
const express = require('express');

const router = express.Router();

router.get('/', controllers.getAll);

router.get('/search/:item', controllers.getOne);

router.post('/', controllers.create);

router.put('/:id', controllers.update);

router.delete('/:id', controllers.delete);

module.exports = router;
