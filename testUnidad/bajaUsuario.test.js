const request = require('supertest');
const routes = require('./src/routes/routes');
const session = require('supertest-session');
const app = require('./src/app.js');
const { beforeAll} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

test('[Baja usuario] correcto', async () => {

    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response2 = await testSession.post('/usuarios/baja');
    expect(response2.status).toBe(302);
    expect(response2.text).toBe("Found. Redirecting to /");

});
test('[Baja usuario]  incorrecto sin session inciada', async () => {

    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};
    const response = await request(app).post('/usuarios/baja');
    expect(response.status).toBe(302);
    expect(response.text).toBe("Found. Redirecting to /login");
});
