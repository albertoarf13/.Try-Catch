aclaracionesController = {};
aclaracionesController.likeRespuesta = (req,res) => {
    const idAclaracion = req.body.idAclaracion;
    const correo = req.body.correo;
    console.log(idAclaracion, correo)
    req.getConnection((err, conn)=>{
        conn.query('select likes, dislikes from valorar_aclaracion where correo = ? and idAclaracion = ?;', [correo, idAclaracion], (err,result)=>{
            console.log(result);

            if(err){
                res.json(err);
            }else if(!result.length){
           
                conn.query('insert into valorar_aclaracion values (?,?,0,1);', [correo, idAclaracion], (err, resultInsert)=>{
        
                    if(err){
                        res.status(500).json(err);
                    }else{
                        res.redirect('back');
                    }
                });
            }else if(result[0].likes){
                conn.query('delete from valorar_aclaracion where correo = ? and idAclaracion = ?;', [correo, idAclaracion], (err, resultUpt)=>{
        
                    if(err){
                        res.status(500).json(err);
                    }else{
                        res.redirect('back');
                    }
                });
            }else if(result[0].dislikes){
                conn.query('UPDATE valorar_aclaracion SET likes = 1, dislikes = 0 where correo = ? and idAclaracion = ?;', [correo, idAclaracion], (err, resultUpt)=>{
    
                    if(err){
                        res.status(500).json(err);
                    }else{
                          res.redirect('back');
                    }
                });
            }
        });
    });

}

aclaracionesController.actualizar_aclaracion = (req, res) =>{
    let respuesta = req.body.respuesta;
    let id = req.params.id;
    let idPregunta = req.session.idPregunta;

    console.log("Editar",respuesta,id);
    if(respuesta.length <= 0){
        res.redirect('/preguntas/mostrar/'+ idPregunta+ 'error='+ encodeURIComponent('La respuesta no puede estar vacía'));
        return;
    }
    req.getConnection((err, conn)=>{

        conn.query('UPDATE respuesta_a_respuesta SET descripcion = ? WHERE id = ?', [respuesta, id], (err, result)=>{
            
            if(err){
                res.status(500).json(err);
                return;
            }
            console.log("Editar", result);
            res.redirect('back');
        })
    });

}

module.exports = aclaracionesController;