const req = require("express/lib/request");

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
            //console.log(infoPregunta);

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

                // Esto es para saber si ya le dimos like o dislike y eso
                let correoUsuarioActual = null;
                if(req.session.correo){
                    correoUsuarioActual = req.session.correo;
                }

                conn.query(`select respuesta.*, aclaracion.id as idAclaracion,  aclaracion.descripcion as descripcionRespuestaARespuesta, aclaracion.correo as correoRespuestaARespuesta, aclaracion.a_likes as a_likes, aclaracion.a_dislikes, aclaracion.a_has_dado_like, aclaracion.a_has_dado_dislike
                from (
                    select respuesta.*, 
                    SUM(valorar.likes) as likes, SUM(valorar.dislikes) as dislikes, 
                    SUM(case when valorar.correo = ? and valorar.likes = 1 then 1 else 0 end) as has_dado_like,
                    SUM(case when valorar.correo = ? and valorar.dislikes = 1 then 1 else 0 end) as has_dado_dislike
                    from respuesta
                    left join valorar
                    on respuesta.id = valorar.idRespuesta
                    where respuesta.idPregunta = ?
                    group by respuesta.id
                ) as respuesta
                left join (select respuesta_a_respuesta.*, SUM(valorar_aclaracion.likes) as a_likes, SUM(valorar_aclaracion.dislikes) as a_dislikes, 
                SUM(case when valorar_aclaracion.correo = ? and valorar_aclaracion.likes = 1 then 1 else 0 end) as a_has_dado_like,
                SUM(case when valorar_aclaracion.correo = ? and valorar_aclaracion.dislikes = 1 then 1 else 0 end) as a_has_dado_dislike
                from respuesta_a_respuesta
                left join valorar_aclaracion
                on respuesta_a_respuesta.id = valorar_aclaracion.idAclaracion
                group by respuesta_a_respuesta.id) as aclaracion
                on respuesta.id = aclaracion.idRespuesta;`, [correoUsuarioActual,correoUsuarioActual,idPregunta,correoUsuarioActual,correoUsuarioActual], (err, respuestas)=>{

                    console.log('Adios', respuestas)

                    let respuestasObjeto = {};
                        if(err){
                            res.json(err);
                        }
                    respuestas.forEach(respuesta => {
                        

                        if(!respuestasObjeto.hasOwnProperty(`${respuesta.id}`)){

                            respuestasObjeto[respuesta.id] = {}
                            
                            respuestasObjeto[respuesta.id].id = respuesta.id;
                            respuestasObjeto[respuesta.id].descripcion = respuesta.descripcion;
                            respuestasObjeto[respuesta.id].imagen = respuesta.imagen;
                            respuestasObjeto[respuesta.id].correo = respuesta.correo;
                            respuestasObjeto[respuesta.id].likes = respuesta.likes;
                            respuestasObjeto[respuesta.id].dislikes = respuesta.dislikes;
                            respuestasObjeto[respuesta.id].has_dado_like = respuesta.has_dado_like;
                            respuestasObjeto[respuesta.id].has_dado_dislike = respuesta.has_dado_dislike;


                            respuestasObjeto[respuesta.id].respuestasARespuesta = [];
                        }

                        if(respuesta.descripcionRespuestaARespuesta != null){
                            respuestasObjeto[respuesta.id].respuestasARespuesta.push({
                                id: respuesta.idAclaracion,
                                descripcion: respuesta.descripcionRespuestaARespuesta,
                                correo: respuesta.correoRespuestaARespuesta,
                                likes: respuesta.a_likes,
                                dislikes: respuesta.a_dislikes,
                                has_dado_like: respuesta.a_has_dado_like,
                                has_dado_dislike: respuesta.a_has_dado_dislike,
                            });
                          
                        }
                        
                    })


                    let respuestasOficial = []

                    Object.entries(respuestasObjeto).forEach(respuesta=>{
                        respuestasOficial.push(respuesta[1]);
                    })
            
                    console.log(respuestasOficial)
                    var pregs = JSON.parse(JSON.stringify(infoPregunta));

                    res.status(450).render('atributosPregunta.ejs', {
                        preguntas:pregs[0],
                        respuestas: respuestasOficial,
                        errorQuery: req.query.error
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


                etiquetas.forEach(etiqueta => {
                    conn.query('INSERT INTO etiqueta_pregunta(id_etiqueta, id_pregunta) VALUES(?,?)', [etiqueta, result.insertId], (err, result)=>{
                        if(err){
                            //res.json(err);
                            return;
                        }
                    })
                })

                res.redirect('/preguntas/mostrar/'+result.insertId);
            }
        })
    });
    
}

preguntasController.actualizar_pregunta = (req, res) => {

    let {titulo, descripcion, etiquetas} = req.body;
    let id = req.params.id;
    let imgBorrada = req.body.delImagen;
  
    if(titulo.length <= 0 || descripcion.length <= 0 || etiquetas == undefined){
       res.status(450).json('El título, descripción o etiquetas no pueden estar vacíos');
        return;
    }

    let imagen = null;
    let query = 'UPDATE pregunta SET titulo = ?, descripcion = ?, '
    let queryArgs = [titulo, descripcion, id];

    if(req.file != undefined){
        imagen = req.file.buffer.toString('base64');
        queryArgs = [titulo, descripcion, imagen, id,req.session.correo];
        query += 'imagen = ? '
    }

    if(imgBorrada == "true"){
        query += 'imagen = ? '
        queryArgs = [titulo, descripcion, imagen, id, req.session.correo];
        imagen = 'null';
    }

    req.getConnection((err, conn)=>{

        conn.query(query + 'WHERE id = ? AND correo = ?', queryArgs, (err, result)=>{
            if(err){
                res.json(err);
                return;
            }
            else{

                if(!Array.isArray(etiquetas)){
                    etiquetas = [etiquetas];
                }
                conn.query('DELETE FROM etiqueta_pregunta WHERE id_pregunta = ?', [id], (err, result) => {
                    if(err){
                        res.json(err);
                    }
                })

                etiquetas.forEach(etiqueta => {
                    conn.query('INSERT INTO etiqueta_pregunta(id_etiqueta, id_pregunta) VALUES(?,?)', [etiqueta, id], (err, result)=>{
                        if(err){
                            res.json(err);
                            return;
                        }
                    })
                })

                res.redirect('/preguntas/mostrar/'+ id);
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
    
    console.log("pagina", parseInt("sda"));
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
        conn.query(`select pregunta.*, num_respuestas, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
        from (
            select pregunta.*, COUNT(respuesta.id) as num_respuestas
            from pregunta
            left join respuesta
            on pregunta.id = respuesta.idPregunta
            group by pregunta.id
        ) as pregunta
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

let query_busqueda_basica = `select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
    from (
        select pregunta.*, COUNT(respuesta.id) as num_respuestas
        from pregunta
        left join respuesta
        on pregunta.id = respuesta.idPregunta
        group by pregunta.id
    ) as pregunta
    left join etiqueta_pregunta
    on pregunta.id =  etiqueta_pregunta.id_pregunta
    left join etiqueta
    on etiqueta_pregunta.id_etiqueta = etiqueta.id
    where titulo LIKE ?
    group by pregunta.id
    order by id desc
    limit 10 offset ?;`;

let query_busqueda_no_respondidas = `select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
    from (
        select pregunta.*, COUNT(respuesta.id) as num_respuestas
        from pregunta
        left join respuesta
        on pregunta.id = respuesta.idPregunta
        group by pregunta.id
    ) as pregunta
    left join etiqueta_pregunta
    on pregunta.id =  etiqueta_pregunta.id_pregunta
    left join etiqueta
    on etiqueta_pregunta.id_etiqueta = etiqueta.id
    where titulo LIKE ? and pregunta.num_respuestas = 0
    group by pregunta.id
    order by id desc
    limit 10 offset ?;`;

let query_busqueda_respondidas = `select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
    from (
        select pregunta.*, COUNT(respuesta.id) as num_respuestas
        from pregunta
        left join respuesta
        on pregunta.id = respuesta.idPregunta
        group by pregunta.id
    ) as pregunta
    left join etiqueta_pregunta
    on pregunta.id =  etiqueta_pregunta.id_pregunta
    left join etiqueta
    on etiqueta_pregunta.id_etiqueta = etiqueta.id
    where titulo LIKE ? and pregunta.num_respuestas > 0
    group by pregunta.id
    order by id desc
    limit 10 offset ?;`;

let query_busqueda_por_etiquetas = `select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
    from pregunta
    left join etiqueta_pregunta
    on pregunta.id =  etiqueta_pregunta.id_pregunta
    left join etiqueta
    on etiqueta_pregunta.id_etiqueta = etiqueta.id
    where pregunta.id IN (
        select distinct pregunta.id
        from etiqueta_pregunta
        inner join pregunta
        on etiqueta_pregunta.id_pregunta = pregunta.id
        where titulo LIKE ? and id_etiqueta in (?)
    )
    group by pregunta.id
    order by pregunta.id desc
    limit 10 offset ?;`;

let query_busqueda_por_etiquetas_no_respondidas = `select *
from (
	select pregunta.*, COUNT(respuesta.id) as num_respuestas
	from(
		select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
		from pregunta
		left join etiqueta_pregunta
		on pregunta.id =  etiqueta_pregunta.id_pregunta
		left join etiqueta
		on etiqueta_pregunta.id_etiqueta = etiqueta.id
		where pregunta.id IN (
			select distinct pregunta.id
			from etiqueta_pregunta
			inner join pregunta
			on etiqueta_pregunta.id_pregunta = pregunta.id
			where titulo LIKE ? and id_etiqueta in (?)
		)
		group by pregunta.id
	) as pregunta
	left join respuesta
	on pregunta.id = respuesta.idPregunta
	group by pregunta.id
) as pregunta
where pregunta.num_respuestas = 0
order by pregunta.id desc
limit 10 offset ?;`;

let query_busqueda_por_etiquetas_respondidas = `select *
from (
	select pregunta.*, COUNT(respuesta.id) as num_respuestas
	from(
		select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
		from pregunta
		left join etiqueta_pregunta
		on pregunta.id =  etiqueta_pregunta.id_pregunta
		left join etiqueta
		on etiqueta_pregunta.id_etiqueta = etiqueta.id
		where pregunta.id IN (
			select distinct pregunta.id
			from etiqueta_pregunta
			inner join pregunta
			on etiqueta_pregunta.id_pregunta = pregunta.id
			where titulo LIKE ? and id_etiqueta in (?)
		)
		group by pregunta.id
	) as pregunta
	left join respuesta
	on pregunta.id = respuesta.idPregunta
	group by pregunta.id
) as pregunta
where pregunta.num_respuestas > 0
order by pregunta.id desc
limit 10 offset ?;`;

function sort_by_key_asc(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}

function sort_by_key_desc(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? 1 : ((x > y) ? -1 : 0));
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

    let etiquetas = req.query.etiquetas;
    let la_busqueda_es_por_etiquetas = false;

    // Por defecto es búsqueda básica
    let query = query_busqueda_basica;

    let order_num_val;
    if (req.query.vals == "true"){
        order_num_val = true;
    }else if (req.query.vals == "false"){
        order_num_val = false;
    }

    if(req.query.respondidas == "false"){
        query = query_busqueda_no_respondidas;
    }
    else if(req.query.respondidas == "true"){
        query = query_busqueda_respondidas;
    }

    if(etiquetas != undefined){
        query = query_busqueda_por_etiquetas;
        la_busqueda_es_por_etiquetas = true;

        if(req.query.respondidas == "false"){
            query = query_busqueda_por_etiquetas_no_respondidas;
        }
        else if(req.query.respondidas == "true"){
            query = query_busqueda_por_etiquetas_respondidas;
        }
    }


    if(!la_busqueda_es_por_etiquetas){
        req.getConnection((err, conn)=>{

            conn.query(query, [dynamicInput, offset] ,(err, lista_preguntas)=>{

                lista_preguntas.map(pregunta=>{
                    pregunta.etiquetas = pregunta.etiquetas.split(',');
                    return pregunta.etiquetas;
                })
                
                if(order_num_val){
                    lista_preguntas = sort_by_key_asc(lista_preguntas, "num_respuestas")
                }else{
                    lista_preguntas = sort_by_key_desc(lista_preguntas, "num_respuestas")
                }

                if(err){
                    res.json(err);
                }
                else {
                    let currentPage = req.url;
    
                    if(currentPage.indexOf('page=') == -1){
                        currentPage = currentPage + '&';
                    }
                    else{
                        currentPage = currentPage.substring(0, currentPage.indexOf('page='));
                    }
                    var preguntas = JSON.parse(JSON.stringify(lista_preguntas));                  
                    res.status(401).render('busquedaBasica.ejs', {
                        preguntas : preguntas, 
                        currentPage: currentPage, 
                        pag: page,
                        query : req.query
                    });
                }
            });
    
        });
    }
    else{
        req.getConnection((err, conn)=>{

            if(!Array.isArray(etiquetas)){
                etiquetas = [etiquetas];
            }

            conn.query(query, [dynamicInput, etiquetas, offset] ,(err, lista_preguntas)=>{
                lista_preguntas.map(pregunta=>{
                    pregunta.etiquetas = pregunta.etiquetas.split(',');
                    return pregunta.etiquetas;
                })
    
                if(err){
                    res.json(err);
                }
                else {
                    let currentPage = req.url;
    
                    if(currentPage.indexOf('page=') == -1){
                        currentPage = currentPage + '&';
                    }
                    else{
                        currentPage = currentPage.substring(0, currentPage.indexOf('page='));
                    }
    
                    var preguntas = JSON.parse(JSON.stringify(lista_preguntas));
                    res.status(401).render('busquedaBasica.ejs', {
                        preguntas : preguntas, 
                        currentPage: currentPage, 
                        pag: page,
                        query : req.query
                    });
                }
            });
    
        });
    }
    
    
}




preguntasController.busqueda_por_etiquetas_vista = (req, res) => {

    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM etiqueta', (err, etiquetas)=>{
            
            if(err){
                res.json(err);
            }

            res.render('busquedaPorEtiquetas.ejs', {
                etiquetas: etiquetas,
                error: req.query.error
            });
        })
    });

}

preguntasController.busqueda_por_etiquetas = (req, res) => {
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


    let {busqueda, etiquetas} = req.query;


    if(!Array.isArray(etiquetas)){
        etiquetas = [etiquetas];
    }

    var dynamicInput = '%'.concat(busqueda.concat('%'));

    req.getConnection((err, conn)=>{

        conn.query(`select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
        from pregunta
        left join etiqueta_pregunta
        on pregunta.id =  etiqueta_pregunta.id_pregunta
        left join etiqueta
        on etiqueta_pregunta.id_etiqueta = etiqueta.id
        where pregunta.id IN (
            select distinct pregunta.id
            from etiqueta_pregunta
            inner join pregunta
            on etiqueta_pregunta.id_pregunta = pregunta.id
            where titulo LIKE ? and id_etiqueta in (?)
        )
        group by pregunta.id
        order by pregunta.id desc
        limit 10 offset ?;`, [dynamicInput, etiquetas, offset] ,(err, lista_preguntas)=>{
            
            lista_preguntas.map(pregunta=>{
                pregunta.etiquetas = pregunta.etiquetas.split(',');
                return pregunta.etiquetas;
            })
            
            if(err){
                res.json(err);
            }
            else {

                let currentPage = req.url;

                if(currentPage.indexOf('page=') == -1){
                    currentPage = currentPage + '&';
                }
                else{
                    currentPage = currentPage.substring(0, currentPage.indexOf('page='));
                }

                var preguntas = JSON.parse(JSON.stringify(lista_preguntas));
                res.status(401).render('busquedaBasica.ejs', {
                    preguntas : preguntas, 
                    currentPage: currentPage, 
                    pag: page
                });
            }
        });

    });
    
}

preguntasController.borrar_pregunta = (req, res) =>{
    let idPregunta = req.params.id;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM pregunta where pregunta.id = ? AND correo = ?;', [idPregunta, req.session.correo], (err, infoPregunta)=>{
            res.redirect('/');
        });
    })
};
preguntasController.borrar_respuesta = (req, res) =>{
    
    let idRespuesta = req.params.id;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM respuesta where respuesta.id = ? AND correo = ?;', [idRespuesta, req.session.correo], (err, infoPregunta)=>{
            res.redirect('back');
        });
    })
};

preguntasController.borrar_respuesta_respuesta = (req, res) =>{
    
    let id = req.params.id;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM respuesta_a_respuesta where respuesta_a_respuesta.id = ? AND correo = ?;', [id, req.session.correo], (err, infoPregunta)=>{
            res.redirect('back');
        });
    })
};
preguntasController.vista_editar_pregunta = (req, res) => {
    let id = req.params.id;

    req.getConnection((err, conn)=>{
        conn.query(`select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
        from pregunta
        left join etiqueta_pregunta
        on pregunta.id =  etiqueta_pregunta.id_pregunta
        left join etiqueta
        on etiqueta_pregunta.id_etiqueta = etiqueta.id
        where pregunta.id = ? AND pregunta.correo = ?;`, [id, req.session.correo],  (err, pregunta)=>{
          
            if(err){
                res.json(err);
            }else if(pregunta[0].id == id){
                pregunta.map(pregunta=>{
                    pregunta.etiquetas = pregunta.etiquetas.split(',');
                    return pregunta.etiquetas;
                })

                conn.query('SELECT * FROM etiqueta', (err, etiquetas)=>{
            
                    if(err){
                        res.json(err);
                    }else{
                        res.render('editarPregunta.ejs', {
                            pregunta: pregunta[0],
                            etiquetas: etiquetas
                        });
                    }
                })
            }else{
                res.redirect('/preguntas/mostrar/'+ id);  
            }

        })
    });
}

module.exports = preguntasController;
