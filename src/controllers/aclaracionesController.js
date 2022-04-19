aclaracionesController = {};

aclaracionesController.likeRespuesta = (req,res) => {
    const idAclaracion = req.body.idAclaracion;
    const correo = req.body.correo;
    
    if(correo != req.session.correo){
        res.status(450).render('atributosPregunta.ejs', { error: "Se ha producido un error." });
        return;
    }

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

aclaracionesController.dislikeRespuesta = (req,res) => {
    const idAclaracion = req.body.idAclaracion;
    const correo = req.body.correo;

    if(correo != req.session.correo){
        res.status(450).render('atributosPregunta.ejs', { error: "Se ha producido un error." });
        return;
    }

    req.getConnection((err, conn)=>{
        conn.query('select likes, dislikes from valorar_aclaracion where correo = ? and idAclaracion = ?;', [correo, idAclaracion], (err,result)=>{
            console.log(result);

            if(err){
                res.json(err);
            }else if(!result.length){
           
                conn.query('insert into valorar_aclaracion values (?,?,1,0);', [correo, idAclaracion], (err, resultInsert)=>{
        
                    if(err){
                        res.status(500).json(err);
                    }else{
                        res.redirect('back');
                    }
                });
            }else if(result[0].dislikes){
                conn.query('delete from valorar_aclaracion where correo = ? and idAclaracion = ?;', [correo, idAclaracion], (err, resultUpt)=>{
        
                    if(err){
                        res.status(500).json(err);
                    }else{
                        res.redirect('back');
                    }
                });
            }else if(result[0].likes){
                conn.query('UPDATE valorar_aclaracion SET likes = 0, dislikes = 1 where correo = ? and idAclaracion = ?;', [correo, idAclaracion], (err, resultUpt)=>{
    
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

module.exports = aclaracionesController;