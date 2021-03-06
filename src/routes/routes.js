const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const usersController = require('../controllers/usersController');
const preguntasController = require('../controllers/preguntasController');
const respuestasController = require('../controllers/respuestasController');
const aclaracionesController = require('../controllers/aclaracionesController');

router.get('/', preguntasController.prueba_mostrar_preguntas_recientes);
router.get('/preguntas/page=:pag', preguntasController.prueba_mostrar_preguntas_recientes);
 
 
router.post('/sign-up', usersController.sign_up);
router.get('/sign-up_page', usersController.sign_up_page);

router.post('/login', usersController.login);
router.post('/loginGoogle', usersController.loginGoogle);
router.get('/login', isNotLogged, usersController.login_page);
router.get('/logout', isLogged, usersController.logout);
router.get('/atributoPregunta/:id', preguntasController.atribs);
router.get('/busqueda', preguntasController.busqueda_basica);
router.get('/preguntas/mostrar/:id', preguntasController.atribs);

//Preguntas
router.get('/preguntas/crear', isLogged, preguntasController.crear_pregunta_vista);
router.post('/preguntas/crear', isLogged, upload.single("imagen"), preguntasController.crear_pregunta);
router.get('/preguntas/mostrar-imagenes', preguntasController.prueba_mostrar_imagenes);
router.get('/preguntas/mostrar-etiquetas', preguntasController.prueba_mostrar_etiquetas);
router.get('/preguntas/:id/editar', isLogged, preguntasController.vista_editar_pregunta);

//router.get('/preguntas/:id/responder', isLogged, preguntasController.prueba_responder_vista);
router.post('/preguntas/:id/responder', isLogged, upload.single("imagen"), preguntasController.responder_pregunta);
router.post('/preguntas/:idPregunta/responder-respuesta/:idRespuesta', isLogged, preguntasController.responder_respuesta);

router.post('/preguntas/:id/actualizar', isLogged, upload.single("imagen"), preguntasController.actualizar_pregunta);

//Respuestas
router.post('/preguntas/respuesta/:id/actualizar', isLogged, upload.single("imagen"), respuestasController.actualizar_respuesta);
router.post('/preguntas/respuesta/like', isLogged, respuestasController.likeRespuesta);
router.post('/preguntas/respuesta/dislike', isLogged, respuestasController.dislikeRespuesta);
router.get('/preguntas/respuesta/:id/editar', isLogged, respuestasController.vista_editar_respuesta);

//Aclaracion
router.post('/preguntas/aclaracion/:id/actualizar', isLogged, aclaracionesController.actualizar_aclaracion);
router.post('/preguntas/aclaracion/like', isLogged, aclaracionesController.likeRespuesta);
router.post('/preguntas/aclaracion/dislike', isLogged, aclaracionesController.dislikeRespuesta);

//Busqueda por etiquetas
router.get('/preguntas/busqueda-por-etiquetas-vista', preguntasController.busqueda_por_etiquetas_vista);
router.get('/preguntas/busqueda-por-etiquetas', preguntasController.busqueda_basica);

//Editar nuestro perfil de usuario
router.get('/usuarios/editar-mi-perfil', isLogged, usersController.vista_editar_usuario);
router.post('/usuarios/:correo/update', upload.single("imagen"), usersController.actualizar_usuario);
router.post('/usuarios/baja', isLogged, usersController.baja_usuario);

//Ver atributos de usuario
router.get('/usuarios/:correo', usersController.mostrar);

//borrar comentario
router.get('/preguntas/:id/borrar_pregunta', isLogged, preguntasController.borrar_pregunta)
router.get('/preguntas/:id/borrar_respuesta', isLogged, preguntasController.borrar_respuesta)
router.get('/preguntas/:id/borrar_respuesta_respuesta', isLogged, preguntasController.borrar_respuesta_respuesta)



function isLogged(req, res, next){
    if(req.session.correo){
        next();
    }
    else{
        res.redirect("/login");
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

