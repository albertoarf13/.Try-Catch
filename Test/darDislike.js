const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const session = require('supertest-session');
const { beforeAll} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
test('[Dar dislike]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await request(app).post("/preguntas/respuesta/dislike").send({id:1 , correo:"prueba@prueba.es"});
    expect(response1.text).toBe(200);
});

test('[Dar dislike]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await request(app).post("/preguntas/respuesta/dislike").send({id:2 , correo:"prueba@prueba.es"});;
    expect(response1.text).toBe(200);
});

test('[Dar dislike]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await request(app).post("/preguntas/respuesta/dislike").send({id:3 , correo:"prueba@prueba.es"});;
    expect(response1.text).toBe();
});