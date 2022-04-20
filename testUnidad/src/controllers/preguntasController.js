const preguntasController = {};
var preguntas = [];


let query_busqueda_basica = `select pregunta.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
    from pregunta
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

preguntasController.atribs = (req, res) => {
    const idPregunta = req.params.id;
    //dummy
    const pregunta = {
        titulo: "Pregunta test",
        descripcion: "Pregunta con etiqueta ",
        etiquetas: [1]
    }
    preguntas = new Map();
    preguntas.set('1',pregunta);
    console.log(preguntas.get(idPregunta));
    if(preguntas.get(idPregunta) == undefined){
         res.status(451).render('atributosPregunta.ejs', { error: "No se ha podido encontrar la pregunta" });
    }else{
        res.status(450).render('atributosPregunta.ejs', {preguntas:preguntas.get(idPregunta),
                                                respuestas: []});
    }
}

preguntasController.crear_pregunta_vista = (req, res) => { // Desaparece
    res.render('crearPregunta.ejs', {
        etiquetas: etiquetas,
        error: req.query.error
    });
 
}

preguntasController.crear_pregunta = (req, res) => {
    const {titulo, descripcion, etiquetas} = req.body;
    console.log(req.body);
    if(titulo.length <= 0 || descripcion.length <= 0 || etiquetas == undefined){
        res.redirect('/preguntas/crear?error=' + encodeURIComponent('El título, descripción y etiquetas no pueden estar vacíos'));
        return;
    }

    let imagen = null;

    if(req.file != undefined){
        imagen = req.file.buffer.toString('base64');
    }
    const file = imagen;
    preguntas.push({titulo:titulo, descripcion:descripcion, etiquetas:etiquetas, file:file});

    res.redirect('/preguntas/crear');
}

preguntasController.prueba_mostrar_imagenes = (req, res) => {
        
    res.status(450).render('prueba-mostrar-imagenes.ejs', {
        preguntas: preguntas
    })
    
}

preguntasController.prueba_mostrar_etiquetas = (req, res) => {

    res.status(450).render('prueba.ejs', {
        preguntas: preguntas,
        error: req.query.error
    });
    
}


preguntasController.prueba_mostrar_preguntas_recientes = (req, res) => {

    res.status(450).render('index.ejs', {
        preguntas: preguntas,
        error: req.query.error
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
    res.redirect('/preguntas/mostrar/'+ idPregunta);
}


preguntasController.responder_respuesta = (req, res) =>{

    let respuesta = req.body.respuesta;
    let idPregunta = req.params.idPregunta;
    let idRespuesta = req.params.idRespuesta;

    if(respuesta.length <= 0){
        res.redirect('/preguntas/mostrar/'+ idPregunta+ 'error='+ encodeURIComponent('La respuesta no puede estar vacía'));
        return;
    }
    res.redirect('/preguntas/mostrar/'+ idPregunta);


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

    let order_num_val;
    if (req.query.vals == "true"){
        // nada
    }else if (req.query.vals == "false"){
        // nada
    }

    if(req.query.respondidas == "false"){
        // nada
    }
    else if(req.query.respondidas == "true"){
        // nada
    }

    if(etiquetas != undefined){
        
        la_busqueda_es_por_etiquetas = true;

        if(req.query.respondidas == "false"){
            // nada
        }
        else if(req.query.respondidas == "true"){
            // nada
        }
    }

    //nummies
    var lista_preguntas = new Object([]);
    if(dynamicInput == 'test')
    {
        var lista_preguntas = [{
            id: 244,
            titulo: 'Pregunta de test',
            descripcion: 'test',
            imagen: null,
            correo: 'alberiva@ucm.es',
            etiquetas: 'c++,java,GPS'} ]
    }
   
    etiquetas = req.query.etiquetas;
    la_busqueda_es_por_etiquetas = false;

    // Por defecto es búsqueda básica
    let query = query_busqueda_basica;

    if(req.query.respondidas == "false"){
        query = query_busqueda_no_respondidas;
        console.log("hola..............................");
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

        lista_preguntas.map(pregunta=>{
            pregunta.etiquetas = pregunta.etiquetas.split(',');
            return pregunta.etiquetas;
        })
        
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
    else{
        
        if(!Array.isArray(etiquetas)){
            etiquetas = [etiquetas];
        }

          
        lista_preguntas.map(pregunta=>{
            pregunta.etiquetas = pregunta.etiquetas.split(',');
            return pregunta.etiquetas;
        })
       
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


module.exports = preguntasController;