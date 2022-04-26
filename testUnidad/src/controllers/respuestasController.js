const respuestasController = {};


respuestasController.likeRespuesta = (req,res) => {
    const idRespuesta = req.body.id;
    const correo = req.body.correo;
    if(idRespuesta == 1){
        result = {likes: 0, dislikes: 1};
    }
    else if(idRespuesta == 2){
        result = {likes: 1, dislikes: 1};
    }else{
        result = {likes: 1, dislikes: 0};
    }

    if(result.length == 0){
        
        res.redirect('back');

    }else if(result[0].likes == 1){

        res.redirect('back'); 

    }else if(result[0].dislikes == 1){
        res.redirect('back');

    }
}


respuestasController.actualizar_respuesta = (req, res) =>{

    let descripcion = req.body.descripcion;
    let id = req.params.id;
    let idPregunta = req.body.idPregunta;
    let imgBorrada = req.body.delImagen;

    if(descripcion.length <= 0){
        res.status(450).json('La respuesta no puede estar vacía');
        return;
    }

    let query = 'UPDATE respuesta SET descripcion = ? '
    let queryArgs = [descripcion, id];

    let imagen = null;

    if(req.file != undefined){
        imagen = req.file.buffer.toString('base64');
        query += ',imagen = ? '
        queryArgs = [descripcion, imagen, id];
    }

    if(imgBorrada == "true"){
        query += ',imagen = ? '
        queryArgs = [descripcion, imagen, id];
        imagen = 'null';
    }



    res.redirect('/preguntas/mostrar/'+ idPregunta);
    return;


}

respuestasController.vista_editar_respuesta = (req, res) =>{
    let id = req.params.id;
   
    pregunta.map(pregunta=>{
        pregunta.etiquetas = pregunta.etiquetas.split(',');
        return pregunta.etiquetas;
    })

    res.render('editarRespuesta.ejs', {
            pregunta: pregunta[0],
            respuesta: respuesta[0]
    });

}

module.exports = respuestasController;