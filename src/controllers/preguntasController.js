const preguntasController = {};

preguntasController.crear_pregunta_vista = (req, res) => {

    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM etiqueta', (err, etiquetas)=>{
            
            if(err){
                res.json(err);
            }

            res.render('prueba-crear-pregunta.ejs', {
                etiquetas: etiquetas
            })
        })
    });

}

preguntasController.crear_pregunta = (req, res) => {

    let {titulo, descripcion, etiquetas} = req.body;

    if(titulo.length <= 0 || descripcion.length <= 0){
        res.render('prueba-crear-pregunta.ejs', { error: "El título y descripción no pueden estar vacíos" });
        return;
    }

    let imagen = null;

    if(req.file != undefined){
        imagen = req.file.buffer.toString('base64');
    }

    req.getConnection((err, conn)=>{

        conn.query('INSERT INTO PREGUNTA_V2(titulo, descripcion, imagen, correo) VALUES(?,?,?,?)', [titulo, descripcion, imagen, req.session.correo], (err, result)=>{
            if(err){
                res.json(err);
            }
            else{
                etiquetas.forEach(etiqueta => {
                    conn.query('INSERT INTO etiqueta_pregunta(id_etiqueta, id_pregunta) VALUES(?,?)', [etiqueta, result.insertId], (err, result)=>{
                        if(err){
                            res.json(err);
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
        conn.query('SELECT * FROM pregunta_v2', (err, preguntas)=>{
            
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
        conn.query(`select pregunta_v2.*, ifnull(GROUP_CONCAT(etiqueta.nombre), '') as etiquetas
        from pregunta_v2
        left join etiqueta_pregunta
        on pregunta_v2.id =  etiqueta_pregunta.id_pregunta
        left join etiqueta
        on etiqueta_pregunta.id_etiqueta = etiqueta.id
        group by pregunta_v2.id;`, (err, preguntas)=>{
            
            if(err){
                res.json(err);
            }

            preguntas.map(pregunta=>{
                pregunta.etiquetas = pregunta.etiquetas.split(',');
                return pregunta.etiquetas;
            })

            res.render('prueba-mostrar-etiquetas.ejs', {
                preguntas: preguntas
            })

        })
    });
    
}


module.exports = preguntasController;