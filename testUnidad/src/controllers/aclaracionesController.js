aclaracionesController = {};

aclaracionesController.likeRespuesta = (req,res) => {
    const idAclaracion = req.body.idAclaracion;
    const correo = req.body.correo;
    if(idAclaracion == 1){
        result = {likes: 0, dislikes: 1};
    }
    else if(idAclaracion == 2){
        result = {likes: 1, dislikes: 0};
    }else if(idAclaracion == 3){
        result = { };
    }
    if(Object.entries(result).length == 0){
        res.redirect('back');

    }else if(result.likes == 1){

        res.redirect('back'); 

    }else if(result.dislikes == 1){
        res.redirect('back');

    }

}
aclaracionesController.dislikeRespuesta = (req,res) => {
    const idAclaracion = req.body.idAclaracion;
    const correo = req.body.correo;
    if(idAclaracion == 1){
        result = {likes: 0, dislikes: 1};
    }
    else if(idAclaracion == 2){
        result = {likes: 1, dislikes: 0};
    }else if(idAclaracion == 3){
        result = { };
    }

    if(Object.entries(result).length == 0){
        res.redirect('back');

    }else if(result.likes == 1){

        res.redirect('back'); 

    }else if(result.dislikes == 1){
        res.redirect('back');

    }
}

aclaracionesController.actualizar_aclaracion = (req, res) =>{
    let respuesta = req.body.respuesta;
    let id = req.params.id;
    let idPregunta = req.session.idPregunta;
    console.log(respuesta.length)
    if(respuesta.length <= 0){
        res.status(450).json('La respuesta no puede estar vacia');
        return;
    }
    res.redirect('back');
    console.log("HOla...........");
}

module.exports = aclaracionesController;