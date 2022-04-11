const etiquetasController = {};
const res = require('express/lib/response');
const mysql = require('mysql');

var con = mysql.createConnection({
    host: 'trycatchserver.mysql.database.azure.com',
    user: 'admintrycatch',
    password: 'zbCm8AVJC2vzyaGU',
    port: 3306,
    database: 'database1'
});

etiquetasController.pruebaVista = (req, res) => {
    res.render('viewTestSocket.ejs');
}

etiquetasController.buscarEtiquetas = function(tag, callback) {
    const queryarg = '%'+tag+'%';
    
    con.query("SELECT * FROM etiqueta WHERE nombre like ? limit 6;", [queryarg], function(err, result){
        if(err){
            console.log(err);
            return -1;
        }else{
            let dictTags={};

            result.forEach(function (elem) { 
                dictTags[elem.nombre] = elem.id;
            });
        
            return callback(dictTags);
        }
    });
}




module.exports = etiquetasController;