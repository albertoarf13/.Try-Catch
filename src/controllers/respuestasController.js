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

    let descripcion = req.body.descripcion;
    let id = req.params.id;
    let idPregunta = req.body.idPregunta;
    let imgBorrada = req.body.delImagen;
    

    if(descripcion.length <= 0){
        res.redirect('/preguntas/mostrar/'+ idPregunta+ '?error='+ encodeURIComponent('La respuesta no puede estar vacía'));
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


    req.getConnection((err, conn)=>{

        conn.query(query + 'WHERE id = ? ', queryArgs, (err, result)=>{
            
            if(err){
                res.status(500).json(err);
                return;
            }
            
            res.redirect('/preguntas/mostrar/'+ idPregunta);
            return;
        })
    });

}

respuestasController.vista_editar_respuesta = (req, res) =>{
    let id = req.params.id;

    req.getConnection((err, conn)=>{

        conn.query('select * from respuesta where id = ?', [id], (err, respuesta)=>{
            
            if(err){
                res.status(500).json(err);
                return;
            }
            
            console.log(respuesta);
            conn.query(`select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
            from pregunta
            left join etiqueta_pregunta
            on pregunta.id =  etiqueta_pregunta.id_pregunta
            left join etiqueta
            on etiqueta_pregunta.id_etiqueta = etiqueta.id
            where pregunta.id = ?;`, [respuesta[0].idPregunta],  (err, pregunta)=>{
                
                if(err){
                    res.json(err);
                    return;
                }

                pregunta.map(pregunta=>{
                    pregunta.etiquetas = pregunta.etiquetas.split(',');
                    return pregunta.etiquetas;
                })

                console.log(pregunta[0]);
                res.render('editarRespuesta.ejs', {
                    pregunta: pregunta[0],
                    respuesta: respuesta[0]
                });
            })
            
        })
    });


}

module.exports = respuestasController;