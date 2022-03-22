const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const session = require('supertest-session');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});


test('[Crear pregunta] con sesion iniciada', async () => {

    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};
    const pregunta = {
        titulo: "Pregunta de test",
        descripcion: "test",
        etiquetas: [1,2,3]
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response2.text).toBe('Found. Redirecting to /preguntas/crear');

});

