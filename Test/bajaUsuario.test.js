const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const session = require('supertest-session');;
const { beforeAll} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

test('[Baja usuario] correcto', async () => {

    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response2 = await testSession.post('/usuarios/baja');
    expect(response2.status).toBe(302);
    expect(response2.text).toBe("Found. Redirecting to /");

});
test('[Baja usuario]  incorrecto sin session inciada', async () => {

    const response = await request(app).post('/usuarios/baja');
    expect(response.status).toBe(302);
    expect(response.text).toBe("Found. Redirecting to /login");
});
