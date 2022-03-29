const request = require('supertest');
const routes = require('./src/routes/routes');
const session = require('supertest-session');
const app = require('./src/app.js');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});



test('[Responder pregunta] con sesion iniciada', async () => {

    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
    const respuesta = {
        respuesta: "Respuesta de test iniciando sesion"
    }

    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/1/responder').send(respuesta);
    expect(response2.text).toBe('Found. Redirecting to /preguntas/mostrar/1');
});

test('[Responder pregunta] vacia', async () => {

    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
    const respuesta = {
        respuesta: ""
    }

    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/1/responder').send(respuesta);
    expect(response2.text).toBe('Found. Redirecting to /preguntas/mostrar/1?error=La%20respuesta%20no%20puede%20estar%20vac%C3%ADa');
});

test('[Responder pregunta] sin iniciar sesión', async () => {

    const respuesta = {
        respuesta: "Respuesta de test sin iniciar sesion"
    }

    const response2 = await request(app).post('/preguntas/1/responder').send(respuesta);
    expect(response2.text).toBe('Found. Redirecting to /login');

});


