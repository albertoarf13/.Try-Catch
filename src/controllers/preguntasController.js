const preguntasController = {};

preguntasController.crear_pregunta_vista = (req, res) => {

    res.render('prueba-crear-pregunta.ejs');
}

preguntasController.crear_pregunta = (req, res) => {

    const {titulo, descripcion, etiquetas} = req.body;

    if(titulo.length <= 0 || descripcion.length <= 0){
        res.render('prueba-crear-pregunta.ejs', { error: "El título y descripción no pueden estar vacíos" });
    }


    let imagen = null;

    if(req.file != undefined){
        imagen = req.file.buffer.toString('base64');
    }


    req.getConnection((err, conn)=>{

        console.log('Crear pregunta con correo: ' + req.session.correo);

        conn.query('INSERT INTO PREGUNTA_V2(titulo, descripcion, imagen, correo) VALUES(?,?,?,?)', [titulo, descripcion, imagen, req.session.correo], (err, persona)=>{
            
            if(err){
                res.json(err);
            }
            
            res.render('prueba-crear-pregunta.ejs');

        })
    });
    
}

preguntasController.prueba_mostrar_imagenes = (req, res) => {

    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM pregunta_v2', (err, preguntas)=>{
            
            if(err){
                res.json(err);
            }
            
            //res.json(rows);
            //console.log(personas);

            res.render('prueba-mostrar-imagenes.ejs', {
                preguntas: preguntas
            })
        })
    });
    
}


module.exports = preguntasController;