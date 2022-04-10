const app = require('./app');
const path = require('path')
const express = require('express');

const routes = require('./routes/routes');
//settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Esto es para poder acceder al valor en todas las vistas edsde ejs
app.use(function(request, response, next) {
    if (request.session.correo) {
        response.locals.correo = request.session.correo;
    }
    next();
});


//archivos estaticos
app.use(express.static('public'));

//Importar en vista el socket
app.get('/socket.io/:socketelem', function(req, res) {
    console.log(path.join(__dirname + "/../node_modules/socket.io/client-dist/socket.io.js"));
    res.sendFile(path.join(__dirname + "/../node_modules/socket.io/client-dist/" + req.params.socketelem));
});

app.use('/', routes);
// Empezar el servidor
const server = app.listen(app.get('port'), ()=>{
    console.log('Server running')
});

//Socket
const io = require('socket.io')(server);
console.log(app.connection);

//Socket
io.on('connection', socket => {
    console.log('a user connected');
    const etiquetasController = require('./controllers/etiquetasController');

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });

    socket.on('buscarTags', mensaje => {
        console.log('buscando tags', mensaje);
        etiquetasController.buscarEtiquetas(mensaje, function(result){
            console.log('Resultado:', result);
            socket.emit('respTags', result);
        });
    });
});
