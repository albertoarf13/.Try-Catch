const app = require('./app');
const path = require('path')
const express = require('express');
const session = require('express-session');
const routes = require('./routes/routes');
//settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




// session
app.use(session({secret: '123',saveUninitialized: true,resave: true}));

// Esto es para poder acceder al valor en todas las vistas edsde ejs
app.use(function(request, response, next) {
    if (request.session.correo) {
        response.locals.correo = request.session.correo;
    }
    next();
});


//archivos estaticos
app.use(express.static('public'));

app.use('/', routes);
// Empezar el servidor
app.listen(app.get('port'), ()=>{
    console.log('Server running')
});
