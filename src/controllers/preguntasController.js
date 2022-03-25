const preguntaController = {};
//const dbUser = require(../integracion/dbUser)

preguntaController.atribs = (req, res) => {
    const idPregunta = req.params.id;

    req.getConnection((err, conn)=>{
        
        conn.query("SELECT * FROM pregunta WHERE id = ?", [idPregunta], (err, infoPregunta)=>{

            if(err){
                res.json(err);
            }
            else if(infoPregunta.length == 0){
                res.render('atributosPregunta.ejs', { error: "No se ha podido encontrar la pregunta" });
            }else{
                // res.send(infoPregunta);
                conn.query("select tg.texto from etiqueta tg inner join etiqueta_pregunta tp on tg.id = tp.id_etiqueta where tp.id_pregunta = ?", [idPregunta], (err, tags)=>{
                    if(err){
                        res.json(err);
                    }
                    else if (infoPregunta.length == 0){
                        //res.render('atributosPregunta.ejs', { error: "No se ha podido encontrar la pregunta" });
                    }
                    else{
                        conn.query("select * from respuestas where idPregunta = ?", [idPregunta], (err, resps)=>{
                            if(err){
                                res.json(err);
                            }
                            else if (resp.length == 0){
                                //res.render('atributosPregunta.ejs', { error: "No se ha podido encontrar la pregunta" });
                            }
                            else{
                                res.status(201).send('info', {info:{infoPregunta, tags, resps}})
                            }
                        })
                        
                    }
                    
                })
            }


        });
    });
}

preguntaController.atribs_page = (req, res) => {
    
    res.render('atributosPregunta.ejs');
}