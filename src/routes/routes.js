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

router.post('/login', usersController.login);
router.get('/login', isNotLogged, usersController.login_page);


function isLogged(req, res, next){
    if(req.session.correo){
        next();
    }
    else{
        res.redirect("/");
    }
}

function isNotLogged(req, res, next){
    if(req.session.correo){
        res.redirect("/");
    }
    else{
        next();
    }
}

module.exports = router;

