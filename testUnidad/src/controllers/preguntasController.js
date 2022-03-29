const preguntasController = {};
var preguntas = [];


preguntasController.atribs = (req, res) => {
    const idPregunta = req.params.id;
    //dummy
    const pregunta = {
        titulo: "Pregunta test",
        descripcion: "Pregunta con etiqueta ",
        etiquetas: [1]
    }
    preguntas = new Map();
    preguntas.set('1',pregunta);
    console.log(preguntas.get(idPregunta));
    if(preguntas.get(idPregunta) == undefined){
         res.status(451).render('atributosPregunta.ejs', { error: "No se ha podido encontrar la pregunta" });
    }else{
        res.status(450).render('atributosPregunta.ejs', {preguntas:preguntas.get(idPregunta),
                                                respuestas: []});
    }
}

preguntasController.atribs_page = (req, res) => {
    
    res.render('atributosPregunta.ejs');
}

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


preguntasController.responder_respuesta = (req, res) =>{

    let respuesta = req.body.respuesta;
    let idPregunta = req.params.idPregunta;
    let idRespuesta = req.params.idRespuesta;

    if(respuesta.length <= 0){
        res.redirect('/preguntas/'+ idPregunta +'/responder?error=' + encodeURIComponent('La respuesta no puede estar vacía'));
        return;
    }
    res.redirect('/preguntas/'+ idPregunta +'/responder');


}


preguntasController.busqueda_basica = (req, res) => {
    let page = req.query.page;
    let offset;
    console.log("pagina", page);
    page = parseInt(page);

    if(page == undefined || isNaN(page) || page <= 1){
        offset = 0;
        page = 1;
    }else{
        page = page*1;
        offset = (page*10) - 10;
    }
    
    const info = req.query.bus;
    var dynamicInput = '%'.concat(info.concat('%'));
    //nummies
    var lista_preguntas = new Object([]);
    if(dynamicInput == 'test')
    {
        var lista_preguntas = [{
            id: 244,
            titulo: 'Pregunta de test',
            descripcion: 'test',
            imagen: null,
            correo: 'alberiva@ucm.es',
            etiquetas: 'c++,java,GPS'} ]
    }
    var preguntas = JSON.parse(JSON.stringify(lista_preguntas));
    res.status(451).render('busquedaBasica.ejs', {preguntas : preguntas, currentPage: "/busqueda?bus="+info+"&", pag: page});

}

preguntasController.busqueda_basica_page = (req, res) => {
    res.render('busquedaBasica.ejs');
}


module.exports = preguntasController;