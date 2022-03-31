
const preguntasController = {};
//const dbUser = require(../integracion/dbUser)
preguntasController.atribs = (req, res) => {
    const idPregunta = req.params.id;

    req.getConnection((err, conn)=>{
        
        conn.query(`select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
        from pregunta
        left join etiqueta_pregunta
        on pregunta.id =  etiqueta_pregunta.id_pregunta
        left join etiqueta
        on etiqueta_pregunta.id_etiqueta = etiqueta.id
        where pregunta.id = ?;`, [idPregunta], (err, infoPregunta)=>{
            if(err){
                res.json(err);
            }
            else if(infoPregunta[0].id == null){
               
                res.status(451).render('atributosPregunta.ejs', { error: "No se ha podido encontrar la pregunta" });
                return;
            }else{
                infoPregunta.map(pregunta=>{
                    pregunta.etiquetas = pregunta.etiquetas.split(',');
                    return pregunta.etiquetas;
                })

                conn.query(`select respuesta.id, respuesta.descripcion, respuesta.imagen, respuesta.correo, respuesta_a_respuesta.descripcion as descripcionRespuestaARespuesta, respuesta_a_respuesta.correo as correoRespuestaARespuesta
                from (select * from respuesta where idPregunta = ?) as respuesta
                left join respuesta_a_respuesta
                on respuesta.id = respuesta_a_respuesta.idRespuesta;`, [idPregunta], (err, respuestas)=>{

                    //console.log(respuestas)

                    let respuestasObjeto = {};

                    respuestas.forEach(respuesta => {
                        

                        if(!respuestasObjeto.hasOwnProperty(`${respuesta.id}`)){

                            respuestasObjeto[respuesta.id] = {}
                            
                            respuestasObjeto[respuesta.id].id = respuesta.id;
                            respuestasObjeto[respuesta.id].descripcion = respuesta.descripcion;
                            respuestasObjeto[respuesta.id].imagen = respuesta.imagen;
                            respuestasObjeto[respuesta.id].correo = respuesta.correo;


                            respuestasObjeto[respuesta.id].respuestasARespuesta = [];
                        }

                        if(respuesta.descripcionRespuestaARespuesta != null){

                            respuestasObjeto[respuesta.id].respuestasARespuesta.push({
                                descripcion: respuesta.descripcionRespuestaARespuesta,
                                correo: respuesta.correoRespuestaARespuesta,
                            })
                        }
                        
                    })


                    let respuestasOficial = []

                    Object.entries(respuestasObjeto).forEach(respuesta=>{
                        respuestasOficial.push(respuesta[1]);
                    })
            
                    //console.log(respuestasOficial)
                    var pregs = JSON.parse(JSON.stringify(infoPregunta));

                    res.status(450).render('atributosPregunta.ejs', {
                        preguntas:pregs[0],
                        respuestas: respuestasOficial,
                        error: req.query.error
                    })
 
                })
            }


        });
    });
}
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
                            //res.json(err);
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
    let page = req.params.pag;
    let offset;
    console.log("pagina", page);
    page = parseInt(page);

    if(page == undefined || isNaN(page) || page <= 1){
        offset = 0;
        page = 1;
    }else{
        page = page*1;
        offset = (page*10) - 10;
    }

    console.log("offset", offset);

    req.getConnection((err, conn)=>{
        conn.query(`select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
        from pregunta
        left join etiqueta_pregunta
        on pregunta.id =  etiqueta_pregunta.id_pregunta
        left join etiqueta
        on etiqueta_pregunta.id_etiqueta = etiqueta.id
        group by pregunta.id
        order by id desc
        limit 10 offset ?;`, [offset] ,(err, preguntas)=>{
            
            if(err){
                res.json(err);
            }

            preguntas.map(pregunta=>{
                pregunta.etiquetas = pregunta.etiquetas.split(',');
                return pregunta.etiquetas;
            })

            conn.query(`select count(*) as numPregs from pregunta`, function (err, nPregs, numPregs){
                if(err){
                    res.json(err);
                }
            });

            res.render('index.ejs', {
                preguntas: preguntas,
                pag: page,
                error: req.query.error,
                currentPage: "/preguntas/"
            });

        })
    }); 
}

preguntasController.responder_pregunta = (req, res) =>{

    let respuesta = req.body.respuesta;
    let idPregunta = req.params.id;

    if(respuesta.length <= 0){
        res.redirect('/preguntas/mostrar/'+ idPregunta+ '?error='+ encodeURIComponent('La respuesta no puede estar vacía'));
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
            
            res.redirect('/preguntas/mostrar/'+ idPregunta);
        })
    });

}

preguntasController.responder_respuesta = (req, res) =>{
    let respuesta = req.body.respuesta;
    let idPregunta = req.params.idPregunta;
    let idRespuesta = req.params.idRespuesta;

    if(respuesta.length <= 0){
        res.redirect('/preguntas/mostrar/'+ idPregunta+ 'error='+ encodeURIComponent('La respuesta no puede estar vacía'));
        return;
    }

    req.getConnection((err, conn)=>{

        conn.query('INSERT INTO respuesta_a_respuesta(descripcion,idRespuesta,correo) VALUES(?,?,?)', [respuesta,idRespuesta,req.session.correo], (err, result)=>{
            
            if(err){
                res.status(500).json(err);
                return;
            }
            
            res.redirect('/preguntas/mostrar/'+ idPregunta);
        })
    });

}

preguntasController.busqueda_basica = (req, res) => {
    let page = req.query.page;
    let offset;
    console.log("pagina", page);
    page = parseInt(page);

    if(page == undefined || isNaN(page) || page <= 1){
        offset = 0;
        page = 1;
    }else{
        page = page*1;
        offset = (page*10) - 10;
    }


    const info = req.query.bus;
    var dynamicInput = '%'.concat(info.concat('%'));
    req.getConnection((err, conn)=>{
        //conn.query("SELECT * FROM preguntas WHERE descripcion LIKE ?", [dynamicInput], (err, lista_preguntas)=>{
        conn.query(`select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
        from pregunta
        left join etiqueta_pregunta
        on pregunta.id =  etiqueta_pregunta.id_pregunta
        left join etiqueta
        on etiqueta_pregunta.id_etiqueta = etiqueta.id
        where titulo LIKE ?
        group by pregunta.id
        order by id desc
        limit 10 offset ?;`, [dynamicInput, offset] ,(err, lista_preguntas)=>{
            lista_preguntas.map(pregunta=>{
                pregunta.etiquetas = pregunta.etiquetas.split(',');
                return pregunta.etiquetas;
            })
            if(err){
                res.json(err);
            }
            else {
                var preguntas = JSON.parse(JSON.stringify(lista_preguntas));
                res.status(401).render('busquedaBasica.ejs', {preguntas : preguntas, currentPage: "/busqueda?bus="+info+"&", pag: page});
            }
        });

    });
    
}


module.exports = preguntasController;
