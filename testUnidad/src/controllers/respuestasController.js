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

        if(result.likes == 0){
            res.status(200);
        }else if(result.dislikes == 1){
            res.status(200);
                
        }else{
            return res.status(201);
        }
}

module.exports = respuestasController;