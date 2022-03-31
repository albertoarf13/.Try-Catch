const request = require('supertest');
const app = require('./src/app');
const routes = require('./src/routes/routes');
const session = require('supertest-session');
const { beforeAll} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

test('[Ver vista inicial] ', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(450);

});
test('[Ver vista prueba mostrar etiquetas] ', async () => {
    const response = await request(app).get('/preguntas/mostrar-etiquetas');
    expect(response.status).toBe(450);

});

test('[Ver vista prueba mostrar etiquetas] ', async () => {
    const response = await request(app).get('/preguntas/mostrar-imagenes');
    expect(response.status).toBe(450);

});

test('[Ver vista crear pregunta vista]', async () => {
    const response = await request(app).get('/preguntas/crear');
    expect(response.status).toBe(302);

});


test('[Ver vista inicio de sesion]', async () => {
    const response = await request(app).get('/sign-up_page');
    expect(response.status).toBe(450);

});

test('[Ver vista inicio de sesion] sin sesion', async () => {
    const response = await request(app).get('/login');
    expect(response.status).toBe(450);

});
test('[Ver vista inicio de sesion] con sesion', async () => {

    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
  
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.get('/login');
    expect(response2.status).toBe(302);
});


test('[Ver vista terminar sesion] con sesion', async () => {
    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
  
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.get('/logout');
    expect(response2.status).toBe(302);

});