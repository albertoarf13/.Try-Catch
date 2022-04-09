const respuestasController = {};


respuestasController.likeRespuesta = (req,res) => {
    const idRespuesta = req.query.id;

    
    req.getConnection((err, conn)=>{
        conn.query('UPDATE valorar SET likes = 1 where idRespuesta = ?;', [idRespuesta], (err,result)=>{
            console.log(result);

            if(err){
                res.json(err);
            }else{
                //Dudas
            }
        });

    });

}



module.exports = preguntasController;