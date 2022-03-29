var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'trycatchserver.mysql.database.azure.com',
    user: 'admintrycatch',
    password: 'zbCm8AVJC2vzyaGU',
    port: 3306,
    database: 'database1'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query('delete from usuario where correo = ?', ["prueba@prueba.es"], (err, usuario)=>{
        if(err){
            res.json(err);
        }
        console.log(usuario);
        con.end();
    })
});
