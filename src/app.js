const express = require('express');
const path = require('path')
const mysql = require('mysql');
const morgan = require('morgan');
const myConnection = require('express-myconnection');
const session = require('express-session');

const app = express();

// importar rutas
const routes = require('./routes/routes');

//settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


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


// session
app.use(session({secret: '123',saveUninitialized: true,resave: true}));

// Esto es para poder acceder al valor en todas las vistas edsde ejs
app.use(function(request, response, next) {
    if (request.session.correo) {
        response.locals.correo = request.session.correo;
    }
    next();
});


//routes
app.use('/', routes);


//archivos estaticos
app.use(express.static('public'));




// Empezar el servidor
app.listen(app.get('port'), ()=>{
    console.log('Server running')
})

