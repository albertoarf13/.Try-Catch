const request = require('supertest');
const routes = require('./src/routes/routes');
const app = require('./src/app.js');
const { beforeAll } = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

test('[Inicio de sesion] correo/contraseña correcto', async () => {

    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
    const response = await request(app).post('/login').send(usuario);
    expect(response.status).toBe(302);

});
test('[Inicio de sesion] correo/contraseña incorrecto', async () => {

    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};
    const response = await request(app).post('/login').send(usuario);
    expect(response.status).toBe(402);

});
