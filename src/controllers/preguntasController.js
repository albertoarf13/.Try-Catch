const preguntasController = {};

preguntasController.crear_pregunta_vista = (req, res) => {

    res.render('prueba-crear-pregunta.ejs');
}

preguntasController.crear_pregunta = (req, res) => {

    const {titulo, descripcion, etiquetas, imagen} = req.body;


    req.getConnection((err, conn)=>{

        console.log('Crear pregunta con correo: ' + req.session.correo);

        conn.query('INSERT INTO PREGUNTA(titulo, descripcion, correo) VALUES(?,?,?)', [titulo, descripcion, req.session.correo], (err, persona)=>{
            
            if(err){
                res.json(err);
            }
            
            res.render('prueba-crear-pregunta.ejs');

        })
    });
    
}


module.exports = preguntasController;