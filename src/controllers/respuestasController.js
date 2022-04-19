const respuestasController = {};


respuestasController.likeRespuesta = (req,res) => {
    const idRespuesta = req.body.idRespuesta;
    const correo = req.body.correo;

    if(correo != req.session.correo){
        res.status(450).render('atributosPregunta.ejs', { error: "Se ha producido un error." });
        return;
    }

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

module.exports = respuestasController;