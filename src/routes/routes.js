const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const personasController = require('../controllers/personasController');
const usersController = require('../controllers/usersController');


router.get('/', personasController.list);

router.post('/add', personasController.add);

router.post('/delete', personasController.delete);

router.post('/sign-up', usersController.sign_up);

router.get('/sign-up', usersController.sign_up_page);

module.exports = router;

