const preguntasController = {};
var preguntas = [];
preguntasController.crear_pregunta_vista = (req, res) => { // Desaparece
    res.render('crearPregunta.ejs', {
        etiquetas: etiquetas,
        error: req.query.error
    });
 
}

preguntasController.crear_pregunta = (req, res) => {
    const {titulo, descripcion, etiquetas} = req.body;
    console.log(req.body);
    if(titulo.length <= 0 || descripcion.length <= 0 || etiquetas == undefined){
        res.render('/preguntas/crear?error=' + encodeURIComponent('El título, descripción y etiquetas no pueden estar vacíos'));
        return;
    }

    let imagen = null;

    if(req.file != undefined){
        imagen = req.file.buffer.toString('base64');
    }
    const file = imagen;
    preguntas.push({titulo:titulo, descripcion:descripcion, etiquetas:etiquetas, file:file});

    res.redirect('/preguntas/crear');
}

preguntasController.prueba_mostrar_imagenes = (req, res) => {
        
    res.render('prueba-mostrar-imagenes.ejs', {
        preguntas: preguntas
    })
    
}

preguntasController.prueba_mostrar_etiquetas = (req, res) => {

    res.render('prueba.ejs', {
        preguntas: preguntas,
        error: req.query.error
    });
    
}


preguntasController.prueba_mostrar_preguntas_recientes = (req, res) => {

    res.render('index.ejs', {
        preguntas: preguntas,
        error: req.query.error
    });
}


preguntasController.prueba_responder_vista = (req, res) => {

    let id = req.params.id;
    
    if(preguntas[0] == undefined){
        res.redirect('/');
    }
    else{

        preguntas.map(pregunta=>{
            pregunta.etiquetas = pregunta.etiquetas.split(',');
            return pregunta.etiquetas;
        })

        

            res.render('prueba-responder-pregunta.ejs', {
                pregunta: preguntas[0],
                respuestas, respuestas,
                error: req.query.error
            })

    }
}

preguntasController.responder_pregunta = (req, res) =>{

    let respuesta = req.body.respuesta;
    let idPregunta = req.params.id;

    if(respuesta.length <= 0){
        res.redirect('/preguntas/'+ idPregunta +'/responder?error=' + encodeURIComponent('La respuesta no puede estar vacía'));
        return;
    }

    let imagen = null;

    if(req.file != undefined){
        imagen = req.file.buffer.toString('base64');
    }
    
    res.redirect('/preguntas/'+ idPregunta +'/responder');
}


module.exports = preguntasController;