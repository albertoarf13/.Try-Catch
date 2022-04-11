const respuestasController = {};


respuestasController.likeRespuesta = (req,res) => {
    const idRespuesta = req.body.id;
    const correo = req.body.correo;

    req.getConnection((err, conn)=>{
        conn.query('select count(*) as likes, likes, dislikes from valora where correo = ? and idRespuesta = ?;', [correo, idRespuesta], (err,result)=>{
            console.log(result);

            if(err){
                return -1;
            }else if(result.likes == 0){
                conn.query('insert into valorar values (?,?,0,1);', [correo, idRespuesta], (err,resultInsert)=>{
                    console.log(resultInsert);
        
                    if(err){
                        res.status(500).json(err);
                    }else{
                        res.status(200);
                    }
                });
            }else if(result.dislikes == 1){
                conn.query('UPDATE valorar SET likes = 1, dislikes = 0 where idRespuesta = ?;', [idRespuesta], (err, resultUpt)=>{
                    console.log(resultUpt);
        
                    if(err){
                        res.status(500).json(err);
                    }else{
                        res.status(200);
                    }
                });
            }else{
                return res.status(201);
            }
        });
    });

}

module.exports = respuestasController;