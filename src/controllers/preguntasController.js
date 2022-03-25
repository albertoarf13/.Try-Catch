const preguntasController = {};

preguntasController.crear_pregunta_vista = (req, res) => {

    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM etiqueta', (err, etiquetas)=>{
            
            if(err){
                res.json(err);
            }

            res.render('crearPregunta.ejs', {
                etiquetas: etiquetas,
                error: req.query.error
            });
        })
    });

}

preguntasController.crear_pregunta = (req, res) => {

    let {titulo, descripcion, etiquetas} = req.body;

    if(titulo.length <= 0 || descripcion.length <= 0 || etiquetas == undefined){
        //res.render('prueba-crear-pregunta.ejs', { error: "El título, descripción y etiquetas no pueden estar vacíos" });
        res.redirect('/preguntas/crear?error=' + encodeURIComponent('El título, descripción y etiquetas no pueden estar vacíos'));
        //res.redirect('/preguntas/crear');
        return;
    }

    let imagen = null;

    if(req.file != undefined){
        imagen = req.file.buffer.toString('base64');
    }

    req.getConnection((err, conn)=>{

        conn.query('INSERT INTO pregunta(titulo, descripcion, imagen, correo) VALUES(?,?,?,?)', [titulo, descripcion, imagen, req.session.correo], (err, result)=>{
            if(err){
                res.json(err);
                return;
            }
            else{

                if(!Array.isArray(etiquetas)){
                    etiquetas = [etiquetas];
                }

                console.log(etiquetas);

                etiquetas.forEach(etiqueta => {
                    conn.query('INSERT INTO etiqueta_pregunta(id_etiqueta, id_pregunta) VALUES(?,?)', [etiqueta, result.insertId], (err, result)=>{
                        if(err){
                            res.json(err);
                            return;
                        }
                    })
                })

                res.redirect('/preguntas/crear');
            }
        })
    });
    
}

preguntasController.prueba_mostrar_imagenes = (req, res) => {

    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM pregunta', (err, preguntas)=>{
            
            if(err){
                res.json(err);
            }

            res.render('prueba-mostrar-imagenes.ejs', {
                preguntas: preguntas
            })
        })
    });
    
}

preguntasController.prueba_mostrar_etiquetas = (req, res) => {

    req.getConnection((err, conn)=>{
        conn.query(`select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
        from pregunta
        left join etiqueta_pregunta
        on pregunta.id =  etiqueta_pregunta.id_pregunta
        left join etiqueta
        on etiqueta_pregunta.id_etiqueta = etiqueta.id
        group by pregunta.id;`, (err, preguntas)=>{
            
            if(err){
                res.json(err);
            }

            preguntas.map(pregunta=>{
                pregunta.etiquetas = pregunta.etiquetas.split(',');
                return pregunta.etiquetas;
            })

            res.render('prueba.ejs', {
                preguntas: preguntas,
                error: req.query.error
            });

        })
    });
    
}


preguntasController.prueba_mostrar_preguntas_recientes = (req, res) => {

    req.getConnection((err, conn)=>{
        conn.query(`select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
        from pregunta
        left join etiqueta_pregunta
        on pregunta.id =  etiqueta_pregunta.id_pregunta
        left join etiqueta
        on etiqueta_pregunta.id_etiqueta = etiqueta.id
        group by pregunta.id
        limit 10;`, (err, preguntas)=>{
            
            if(err){
                res.json(err);
            }

            preguntas.map(pregunta=>{
                pregunta.etiquetas = pregunta.etiquetas.split(',');
                return pregunta.etiquetas;
            })

            res.render('index.ejs', {
                preguntas: preguntas,
                error: req.query.error
            });

        })
    }); 
}


preguntasController.prueba_responder_vista = (req, res) => {

    let id = req.params.id;

    req.getConnection((err, conn)=>{
        conn.query(`select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
        from (SELECT * FROM pregunta where id = ?) as pregunta
        left join etiqueta_pregunta
        on pregunta.id =  etiqueta_pregunta.id_pregunta
        left join etiqueta
        on etiqueta_pregunta.id_etiqueta = etiqueta.id
        group by pregunta.id;`, [id], (err, preguntas)=>{
            
            if(err){
                res.json(err);
            }
            if(preguntas[0] == undefined){
                res.redirect('/');
            }
            else{

                preguntas.map(pregunta=>{
                    pregunta.etiquetas = pregunta.etiquetas.split(',');
                    return pregunta.etiquetas;
                })

                conn.query('SELECT * FROM respuesta WHERE idPregunta = ?', [id], (err, respuestas)=>{
            

                    res.render('prueba-responder-pregunta.ejs', {
                        pregunta: preguntas[0],
                        respuestas, respuestas,
                        error: req.query.error
                    })
 
                })

            }
            
        })
    });
    
}

preguntasController.responder_pregunta = (req, res) =>{

    let respuesta = req.body.respuesta;
    let idPregunta = req.params.id;

    if(respuesta.length <= 0){
        res.redirect('/preguntas/'+ idPregunta +'/responder?error=' + encodeURIComponent('La respuesta no puede estar vacía'));
        return;
    }

    let imagen = null;

    if(req.file != undefined){
        imagen = req.file.buffer.toString('base64');
    }


    req.getConnection((err, conn)=>{

        conn.query('INSERT INTO respuesta(descripcion,imagen,idPregunta,correo) VALUES(?,?,?,?)', [respuesta,imagen,idPregunta,req.session.correo], (err, result)=>{
            
            if(err){
                res.status(500).json(err);
                return;
            }
            
            res.redirect('/preguntas/'+ idPregunta +'/responder');
        })
    });

}
// Eliminar
preguntasController.borrar_pregunta_test = (req, res) => {

    let {titulo, descripcion, etiquetas} = req.body;

    if(titulo.length <= 0 || descripcion.length <= 0 || etiquetas == undefined){
        return;
    }


    req.getConnection((err, conn)=>{
        conn.query('SELECT DISTINCT ID FROM pregunta WHERE titulo = ? AND descripcion = ? AND correo = ?) VALUES(?,?,?,?)', [titulo, descripcion, req.session.correo], (err, result)=>{
            if(err){
                res.json(err);
                return;
            }
            else{

                if(!Array.isArray(usario.id)){
                    ids = [usuario.id];
                }

                ids.forEach(id => {
                    conn.query('DELETE FROM etiqueta_pregunta WHERE id_pregunta = ?', [id], (err, result)=>{
                        if(err){
                            res.json(err);
                            return;
                        }
                        else 
                        {
                            conn.query('DELETE FROM pregunta WHERE id = ?', [id], (err, result)=>{
                                if(err){
                                    res.json(err);
                                    return;
                                }
                            });

                        }
                    })
                })

            }
        })
    });
    
}


module.exports = preguntasController;