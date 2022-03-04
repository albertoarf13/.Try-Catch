const controller = {};

controller.list = (req, res)=>{

    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM personas', (err, personas)=>{
            
            if(err){
                res.json(err);
            }
            
            //res.json(rows);
            console.log(personas);

            res.render('personas', {
                data: personas
            })
        })
    });
};

controller.add = (req, res) =>{


    req.getConnection((err, conn)=>{

        conn.query('insert into personas set ?;', [req.body], (err, persona)=>{
            
            if(err){
                res.json(err);
            }
            
            console.log(persona);
            res.redirect('/');

        })
    });

}


controller.delete = (req, res) =>{


    req.getConnection((err, conn)=>{

        conn.query('delete from personas where id = ?', [req.body.id], (err, persona)=>{
            
            if(err){
                res.json(err);
            }
            
            console.log(persona);
            res.redirect('/');

        })
    });

}


module.exports = controller;