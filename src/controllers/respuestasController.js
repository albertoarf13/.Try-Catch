const respuestasController = {};


respuestasController.likeRespuesta = (req,res) => {
    const idRespuesta = req.body.idRespuesta;
    const correo = req.body.correo;

    req.getConnection((err, conn)=>{
        conn.query('select likes, dislikes from valorar where correo = ? and idRespuesta = ?;', [correo, idRespuesta], (err,result)=>{

            if(err){
                return -1;
            }else if(result.length == 0){
     
                conn.query('insert into valorar values (?,?,0,1);', [correo, idRespuesta], (err, resultInsert)=>{
        
                    if(err){
                        res.status(500).json(err);
                    }else{
                        res.redirect('back');
                        return;
                    }
                });
            }else if(result[0].likes == 1){
                conn.query('delete from valorar where correo = ? and idRespuesta = ?;', [correo, idRespuesta], (err, resultUpt)=>{

                    if(err){
                        res.status(500).json(err);
                    }else{
                        res.redirect('back');
                        return;
                    }
                });
            }else if(result[0].dislikes == 1){
                conn.query('UPDATE valorar SET likes = 1, dislikes = 0 where correo = ? and idRespuesta = ?;', [correo, idRespuesta], (err, resultUpt)=>{        
                    if(err){
                        res.status(500).json(err);
                    }else{
                        res.redirect('back');
                        return;
                    }
                });
            }
        });
    });

}

respuestasController.actualizar_respuesta = (req, res) =>{

    let respuesta = req.body.respuesta;
    let idPregunta = req.params.idPregunta;
    let id = req.body.idRespuesta;

    if(respuesta.length <= 0){
        res.redirect('/preguntas/mostrar/'+ idPregunta+ '?error='+ encodeURIComponent('La respuesta no puede estar vacía'));
        return;
    }

    let imagen = null;

    if(req.file != undefined){
        imagen = req.file.buffer.toString('base64');
    }


    req.getConnection((err, conn)=>{

        conn.query('UPDATE respuesta SET descripcion = ?, imagen = ? WHERE id = ? ', [respuesta,imagen, id], (err, result)=>{
            
            if(err){
                res.status(500).json(err);
                return;
            }
            
            res.redirect('back');
            return;
        })
    });

}
module.exports = respuestasController;