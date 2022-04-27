const request = require('supertest');
const routes = require('./src/routes/routes');
const session = require('supertest-session');
const app = require('./src/app.js');
const { beforeAll } = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});
const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
test('[Dar like] sin like y sin dislike', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/respuesta/dislike").send({idRespuesta:1 , correo:"prueba@prueba.es"});
    expect(response1.status).toBe(302);
});
test('[Dar like] sin like y con dislike', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/respuesta/dislike").send({idRespuesta:2 , correo:"prueba@prueba.es"});
    expect(response1.status).toBe(302);
});
test('[Dar like] con like', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/respuesta/dislike").send({idRespuesta:3 , correo:"prueba@prueba.es"});
    expect(response1.status).toBe(302);
});

test('[Dar like aclaracion] sin like y sin dislike', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/aclaracion/dislike").send({idAclaracion:1 , correo:"prueba@prueba.es"});
    expect(response1.status).toBe(302);
});
test('[Dar like aclaracion] sin like y con dislike', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/aclaracion/dislike").send({idAclaracion:2 , correo:"prueba@prueba.es"});;
    expect(response1.status).toBe(302);
});
test('[Dar like aclaracion] con like', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/aclaracion/dislike").send({idAclaracion:3 , correo:"prueba@prueba.es"});;
    expect(response1.status).toBe(302);
});