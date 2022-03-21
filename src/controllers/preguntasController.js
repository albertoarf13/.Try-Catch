const preguntaController = {};
//const dbUser = require(../integracion/dbUser)

preguntaController.atribs = (req, res) => {
    const idPregunta = req.body;

    req.getConnection((err, conn)=>{
        
        conn.query("SELECT * FROM preguntas WHERE idpregunta = ?", [idPregunta], (err, infoPregunta)=>{

            if(err){
                res.json(err);
            }
            else if(infoPregunta.length == 0){
                res.render('atributosPregunta.ejs', { error: "No se ha podido encontrar la pregunta" });
            }else{
                // res.send(infoPregunta);
                conn.query("select tg.texto from tags tg inner join tagpreg tp on tg.idtag = tp.idtag where tp.tagpreg = ?", [idPregunta], (err, tags)=>{
                    if(err){
                        res.json(err);
                    }
                    else if (infoPregunta.length == 0){
                        //res.render('atributosPregunta.ejs', { error: "No se ha podido encontrar la pregunta" });
                    }
                    else{
                        conn.query("select * from respuestas rp where rp.idpregunta = ?", [idPregunta], (err, resps)=>{
                            if(err){
                                res.json(err);
                            }
                            else if (resp.length == 0){
                                //res.render('atributosPregunta.ejs', { error: "No se ha podido encontrar la pregunta" });
                            }
                            else{
                                res.send({infoPregunta, tags, resps})
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