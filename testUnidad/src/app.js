const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const session = require('express-session');
const app = express();

// session
app.use(session({secret: '123',saveUninitialized: true,resave: true}));

app.use(express.json());
//routes


//middlewares
app.use(morgan('dev'));

app.use(myConnection(mysql, {
    host: 'trycatchserver.mysql.database.azure.com',
    user: 'admintrycatch',
    password: 'zbCm8AVJC2vzyaGU',
    port: 3306,
    database: 'database1'
}, 'single'));

app.use(express.urlencoded({
    extend: false
}));

module.exports = app;