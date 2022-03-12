const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const personasController = require('../controllers/personasController');


router.get('/', personasController.list);

router.post('/add', personasController.add);

router.post('/delete', returne = personasController.delete);
console.log(returne);

module.exports = router;

