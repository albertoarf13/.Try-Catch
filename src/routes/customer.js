const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const customerController = require('../controllers/customerController');


router.get('/', customerController.list);

router.post('/add', customerController.add);


module.exports = router;

