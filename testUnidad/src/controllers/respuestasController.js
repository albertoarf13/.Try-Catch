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

module.exports = respuestasController;