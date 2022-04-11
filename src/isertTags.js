const mysql = require('mysql');

var fs = require('fs');
const readline = require('readline');


var con = mysql.createConnection({
    host: 'trycatchserver.mysql.database.azure.com',
    user: 'admintrycatch',
    password: 'zbCm8AVJC2vzyaGU',
    port: 3306,
    database: 'database1'
});

const readInterface = readline.createInterface({
    input: fs.createReadStream('./etiquetas fdi solo Acronimos.txt'),
    output: process.stdout,
    console: false
});

i = 1;

readInterface.on('line', function(line) {
     console.log(i, line);
});

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");

//     i = 1;

    

// });