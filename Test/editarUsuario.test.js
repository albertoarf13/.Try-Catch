const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const session = require('supertest-session');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});


test('[Editar usuario] con sesion iniciada', async () => {

    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
    const info = {nombrePrueba:"nombrePrueba", bioPrueba:"bioPrueba"}

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/usuarios/prueba@prueba.es/update').send(info);
    expect(response2.status).toBe(302);

});

test('[Editar usuario] sin sesion iniciada', async () => {

    const info = {nombrePrueba:"nombrePrueba", bioPrueba:"bioPrueba"}

    let testSession = session(app); 

    const response2 = await testSession.post('/usuarios/prueba@prueba.es/update').send(info);
    expect(response2.text).toBe('Found. Redirecting to /usuarios/editar-mi-perfil');

});

