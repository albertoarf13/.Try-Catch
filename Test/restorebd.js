const mysql = require('mysql');
const bcrypt = require('bcrypt');
const req = require('express/lib/request');
const saltRounds = 10;

restoreBD = {}

restoreBD.restore = async () =>{
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
            con.end();
        })
    });
}
restoreBD.reactive = async () =>{
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
        con.query('update usuario set eliminado=0 where correo = ?', ["hola122@ucm.es"], (err, usuario)=>{
            if(err){
                res.json(err);
            }
            con.end();
        })
    });
}

restoreBD.encrypt = async () =>{
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

        con.query('select contraseya from usuario where correo = ?', ["hola122@ucm.es"], (err, usuario)=>{
            if(err){
                
            }
            console.log(usuario);
            bcrypt.hash(usuario[0].contraseya, saltRounds, function(err, hash) {
                con.query('update usuario set contraseya=? where correo = ?', [hash,"hola122@ucm.es"], (err, usuario)=>{
                    if(err){
                
                    }
                    console.log("Finalizado");
                    con.end();
                })
            });
        })
    });
}

module.exports = restoreBD;



restoreBD.encrypt();